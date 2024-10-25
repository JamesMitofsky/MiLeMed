export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: number
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: number
          profile_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          mode: Database["public"]["Enums"]["mode"]
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          mode: Database["public"]["Enums"]["mode"]
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          mode?: Database["public"]["Enums"]["mode"]
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
          lecture_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url: string
          lecture_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string
          lecture_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      lecture_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: number
          lecture_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: number
          lecture_id: number
          profile_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: number
          lecture_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lecture_events_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lecture_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          chapter_id: number
          content: string
          created_at: string | null
          id: number
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_id: number
          content: string
          created_at?: string | null
          id?: number
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_id?: number
          content?: string
          created_at?: string | null
          id?: number
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lectures_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          age: number | null
          avatar_url: string | null
          created_at: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          semester_number: number | null
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          semester_number?: number | null
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          semester_number?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answers: {
        Row: {
          answer_text: string | null
          answered_at: string | null
          chosen_option_id: number | null
          id: number
          is_correct: boolean | null
          profile_id: string
          question_id: number
          quiz_attempt_id: number
        }
        Insert: {
          answer_text?: string | null
          answered_at?: string | null
          chosen_option_id?: number | null
          id?: number
          is_correct?: boolean | null
          profile_id: string
          question_id: number
          quiz_attempt_id: number
        }
        Update: {
          answer_text?: string | null
          answered_at?: string | null
          chosen_option_id?: number | null
          id?: number
          is_correct?: boolean | null
          profile_id?: string
          question_id?: number
          quiz_attempt_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_chosen_option_id_fkey"
            columns: ["chosen_option_id"]
            isOneToOne: false
            referencedRelation: "quiz_question_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_quiz_attempt_id_fkey"
            columns: ["quiz_attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number
          completed_at: string | null
          id: number
          lecture_id: number
          profile_id: string
          started_at: string | null
        }
        Insert: {
          attempt_number: number
          completed_at?: string | null
          id?: number
          lecture_id: number
          profile_id: string
          started_at?: string | null
        }
        Update: {
          attempt_number?: number
          completed_at?: string | null
          id?: number
          lecture_id?: number
          profile_id?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_question_options: {
        Row: {
          id: number
          is_correct: boolean | null
          option_text: string
          question_id: number
        }
        Insert: {
          id?: number
          is_correct?: boolean | null
          option_text: string
          question_id: number
        }
        Update: {
          id?: number
          is_correct?: boolean | null
          option_text?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string | null
          id: number
          lecture_id: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          lecture_id: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          lecture_id?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_chapter_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          title: string
          description: string
          mode: Database["public"]["Enums"]["mode"]
          sort_order: number
          lecture_count: number
          lectures_completed: number
        }[]
      }
    }
    Enums: {
      gender: "MALE" | "FEMALE" | "OTHER"
      mode: "THEORETICAL" | "PRACTICAL"
      question_type: "OPEN" | "MULTIPLE_CHOICE"
      user_role: "ADMIN" | "MEDICAL_PROFESSIONAL" | "STUDENT" | "STUDENT_TESTER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

