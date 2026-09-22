export type Database = {
  public: {
    Tables: {
      posts: Record<string, any>
      comments: Record<string, any>
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
