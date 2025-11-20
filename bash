# List all products and their current images
npx convex run updateProductImages:listAllProducts

# Update a specific product's images
npx convex run updateProductImages:updateByName '{"name":"Michael Kors","images":["YOUR_IMAGE_URL_1","YOUR_IMAGE_URL_2"]}'
