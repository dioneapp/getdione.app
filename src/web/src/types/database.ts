// database schema types
export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  created_at: string
  updated_at: string
  last_login: string | null
  is_verified: boolean
  subscription_level: string | null
  tester: boolean
}

// extended user type that includes auth metadata
export interface ExtendedUser extends User {
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  last_sign_in_at?: string
}

// database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id'>>
      }
    }
  }
} 