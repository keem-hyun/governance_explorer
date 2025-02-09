export interface PageProps {
  params: Promise<{
    number: string
  }>
}

export interface PaginatedPageProps {
  searchParams: Promise<{ 
    page?: string 
  }>
}