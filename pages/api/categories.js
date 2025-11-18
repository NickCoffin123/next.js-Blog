export default async function handler(req, res){

    const {method} = req;

    if (method !== 'GET'){
        return res.status(405).json({error : "Method not allowed"})
    }

    const {category} = req.query
    if (!category){
        return res.status(400).json({error: "Missing category parameter"})
    }

    const url = `https://cdn.contentful.com/spaces/${process.env.CONTENTFULPSPACE_ID}/environments/${process.env.CONTENTFUL_ENV}/entries?content_type=post&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&fields.categories=${encodeURIComponent(category)}`
    try {
        console.log("Fetching posts from Contentful API using category " + category)
        const response = await fetch(url)
        if (!response.ok){
            const errorBody = await response.text();
            throw new Error(`Failed to fetch posts: ${response.status} ${errorBody}`)
        }
        const data = await response.json()
        const posts = (data.items.map(item => ({
            id: item.sys.id,
            title: item.fields.title,
            content: item.fields.body,
            author: item.fields.author,
            category: item.fields.category,
            image: item.fields.image?.fields?.file?.url || null
        })))

        return res.status(200).json(posts)

    }catch(error){
        console.error("Error fetching posts: " + error.message)
        return res.status(500).json({error: "Failed to fetch posts: " + error.message})
    }
}