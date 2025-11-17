import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await req.json();
    const { query, variables } = requestBody;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !storefrontToken) {
      // During build process or when environment variables are not available
      // Return empty data to allow the build to continue
      console.log('Shopify environment variables not available, returning empty data');
      
      // Check if this is a collections query
      if (query.includes('collections')) {
        return NextResponse.json({
          data: {
            collections: {
              edges: []
            }
          }
        });
      }
      
      // Check if this is a products query
      if (query.includes('products')) {
        return NextResponse.json({
          data: {
            products: {
              edges: []
            }
          }
        });
      }
      
      // Check if this is a menu query
      if (query.includes('menu')) {
        return NextResponse.json({
          data: {
            menu: {
              items: []
            }
          }
        });
      }
      
      // Default empty response
      return NextResponse.json({ data: {} });
    }

    // Ensure store domain starts with https://
    const domain = storeDomain.startsWith('https://') 
      ? storeDomain 
      : `https://${storeDomain}`;
    
    // Construct the Shopify GraphQL API endpoint
    const endpoint = `${domain}/api/2023-01/graphql.json`;

    // Make the request to Shopify
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const responseBody = await result.json();

    if (responseBody.errors) {
      return NextResponse.json(
        { error: responseBody.errors[0].message },
        { status: result.status }
      );
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('GraphQL API error:', error);
    // Return empty data to allow the build to continue
    return NextResponse.json({ data: {} });
  }
}
