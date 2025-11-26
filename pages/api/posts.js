import { verifyToken } from "@/lib/auth";

export default async function handler(req, res) {

    const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
    const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
    const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const ENV = "master";
    const LOCALE = "en-US";

    function requireAuth(handler) {
        return async (req, res) => {
            const token = req.cookies?.token;
            const payload = verifyToken(token);

            if (!payload) {
                return res.status(401).json({ error: "Authentication Required" });
            }

            req.user = payload;

            return handler(req, res);
        };
    }

    if (req.method === "GET") {
        try {
            const { author } = req.query;

            // Optional: Filter posts by author
            const filter = author
                ? `&fields.author[match]=${encodeURIComponent(author)}`
                : "";

            const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries?content_type=post${filter}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${CDA_TOKEN}` }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch Contentful posts: " + response.status);
            }

            const data = await response.json();

            const posts = (data.items || []).map(item => ({
                id: item.sys.id,
                title: item.fields.title,
                content: item.fields.body,
                author: item.fields.author,
                category: item.fields.category || null,
                image: item.fields.image?.fields?.file?.url || null,
                sys: { version: item.sys.version }
            }));

            return res.status(200).json(posts);

        } catch (error) {
            return res.status(500).json({
                error: "Failed to fetch posts: " + error.message
            });
        }
    }

    if (req.method === "POST") {
        return requireAuth(async (req, res) => {
            const { title, body, author, category } = req.body || {};

            if (!title || !body || !author || !category) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            try {
                const createResponse = await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            "Content-Type": "application/vnd.contentful.management.v1+json",
                            "X-Contentful-Content-Type": "post"
                        },
                        body: JSON.stringify({
                            fields: {
                                title: { [LOCALE]: title },
                                body: { [LOCALE]: body },
                                author: { [LOCALE]: author },
                                category: { [LOCALE]: category }
                            }
                        })
                    }
                );

                if (!createResponse.ok) {
                    const text = await createResponse.text();
                    throw new Error(
                        `Failed to create new Post entry: ${createResponse.status} ${text}`
                    );
                }

                const created = await createResponse.json();
                const entryId = created.sys.id;
                const version = created.sys.version;

                // Publish entry
                const publishResponse = await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${entryId}/published`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            "X-Contentful-Version": String(version)
                        }
                    }
                );

                if (!publishResponse.ok) {
                    const text = await publishResponse.text();
                    throw new Error(
                        `Failed to publish entry: ${publishResponse.status} ${text}`
                    );
                }

                return res.status(201).json({
                    id: entryId,
                    title,
                    body,
                    author,
                    category,
                    published: true,
                    message: "Post created and published successfully"
                });

            } catch (error) {
                console.error("ERROR creating post: ", error.message);
                return res.status(500).json({
                    error: "Failed to create post: " + error.message
                });
            }
        })(req, res);
    }

    if (req.method === "PUT") {
        return requireAuth(async (req, res) => {
            const { id, title, body, author, category } = req.body || {};

            if (!id || !title || !body || !author || !category) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            try {
                // Get the existing entry to retrieve version + check permissions
                const entryResponse = await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            "Content-Type": "application/vnd.contentful.management.v1+json"
                        }
                    }
                );

                if (!entryResponse.ok) {
                    const errText = await entryResponse.text();
                    throw new Error(`Failed to fetch entry: ${errText}`);
                }

                const entry = await entryResponse.json();
                const currentVersion = entry.sys.version;

                // RBAC — Only author OR admin can update
                if (
                    entry.fields.author?.[LOCALE] !== req.user.email &&
                    req.user.role !== "admin"
                ) {
                    return res.status(403).json({ error: "Forbidden" });
                }

                // Update
                const updateResponse = await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            "Content-Type":
                                "application/vnd.contentful.management.v1+json",
                            "X-Contentful-Version": String(currentVersion)
                        },
                        body: JSON.stringify({
                            fields: {
                                title: { [LOCALE]: title },
                                body: { [LOCALE]: body },
                                author: { [LOCALE]: author },
                                category: { [LOCALE]: category }
                            }
                        })
                    }
                );

                if (!updateResponse.ok) {
                    const errText = await updateResponse.text();
                    throw new Error(`Failed to update entry: ${errText}`);
                }

                return res.status(204).json({ success: true });

            } catch (err) {
                console.error("PUT Error: ", err.message);
                return res.status(500).json({
                    error: "Failed to update post: " + err.message
                });
            }
        })(req, res);
    }

    if (req.method === "DELETE") {
        return requireAuth(async (req, res) => {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: "ID required" });
            }

            try {
                // fetch local posts to validate author
                const getResponse = await fetch("http://localhost:3000/api/posts");
                const posts = await getResponse.json();

                const post = posts.find(p => p.id === id);

                if (!post) {
                    return res.status(404).json({ error: "Post not found" });
                }

                // RBAC — only the author or admin
                if (post.author !== req.user.email && req.user.role !== "admin") {
                    return res.status(403).json({ error: "Forbidden" });
                }

                // 1) Unpublish
                await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}/published`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${CMA_TOKEN}` }
                    }
                );

                // 2) Delete entry
                await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${CMA_TOKEN}` }
                    }
                );

                return res.status(204).json({ success: true });

            } catch (err) {
                console.error("DELETE Error: ", err.message);
                return res.status(500).json({
                    error: "Failed to delete post: " + err.message
                });
            }
        })(req, res);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method Not Permitted" });
}
