# Assignment 3 Iteration Plan

```
// Lesson 10.1 - Planning for Contentful integration with categories.
// .md is a markdown file wich allows us (as developers) to write informal
// documentation to read in plane text that also allows us to easily convert
// to other formats such as (HTML, PDF, or documentation pages).

// Developers and technical writers typically use .md files to:
    -- Document codebases and projects
    -- Track ideas, brainstorm, design descriptions
    -- Write technical reports similar to wiki's
```

## CMS Choice: Contentful
- **Justification**
- **Scalability**: Robust API with CDN for caching for high traffic
- **Flexibility**: Content modeling for posts and now categories (extensible to Assign 2/3 - Products)
- **Ease of Use**: Manage service, no server startup vs. alternatives
- **Cost**: Free tier is sufficient for this project

## API Integration (Thus far)
- **Endpoints**:
- GET `/api/categories?category=Tech`: Filter posts by category
- POST `/api/posts`: Create post with category
- **Implementation**
- USE `getServerSideProps` in `page/index.js` and `pages/blog/index.js` for post listing
- Fetch from `https"//cdn.contenful.com`
- use `CONTENTFUL_MANAGEMENT_TOKEN` for POST requests - compulsory
- **Modular Design**
- `CategoryContext.js`: Centralized category state, reusable
- `PostForm.js`: Supports category selection for posts
- Reusable: `Header.js`, `NavBAr.js`, `SideBar.js`, `Footer.js`

## Assignment Applications
- **Pattern**: Category filtering mirrors filtering by brand
- **Plan**: Use Contentful for "Product" Content type, `getServerSideProps` for listing, API for routes

## Component Hierarchy
- **Structure**:
- `Layout.js`: Wraps pages with `Header.js`, `NavBar.js`, `SideBar.js`, `Footer.js`
- `PostFiler.js`: Category filtering UI, reusable across pages
- `PostForm.js`: Post creation with category selection
- `PostList.js`: Displays posts reusable in `/` and `/categories/[category]`
- **Benefits**: Maintainable, reusable components reduce duplication
- **Assignment**: Similar hierarchy can be used in assignment for 'product listing'

## Router Strategy
- **Routes**:
  - `/categories/[category]`: Dynamic route for category pages (`/categories/Tech`)
  - `/`: Home
  - `/blog`: Blog listings
  - `/blog/post/[id]`: Post Details
- **Implementation**: Next.js file-based routing
- **Assignment Relevance**: Apply dynamic routes for product details 

## Challenges and Solutions
- **Challenge**: Managing category-based filtering
  - **Solution**: Use `fields.category` in API queries 