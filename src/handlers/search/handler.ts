/* 
request:
query: {
  author: string // author name
  query: string // both authors and name
  page: number
  limit: number
  sort: {
    field: enum [year, name, author, rating]
    direction: desc/asc, a-z/z-a
  }
}
/search?query=qqq&page=0&sort[direction]=desc&sort[field]=name&limit=20
*/
