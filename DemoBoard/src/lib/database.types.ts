export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          author: string
          created_at: string
          updated_at: string
          views: number
          category: string
          tags: string[]
        }
        Insert: {
          id?: string
          title: string
          content: string
          author: string
          created_at?: string
          updated_at?: string
          views?: number
          category: string
          tags?: string[]
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author?: string
          created_at?: string
          updated_at?: string
          views?: number
          category?: string
          tags?: string[]
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
