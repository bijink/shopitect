export async function GET() {
  const results = {
    message: 'Welcome to Shopitect API service.',
  };
  return Response.json(results);
}
