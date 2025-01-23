#!/bin/bash
# cd PICK_THE_DIR/supabase/scripts && chmod +x combine_migrations.sh && ./combine_migrations.sh

echo "🚀 Starting migration combination process..."

# Define paths
migrations_dir="../migrations"
output_file="combined_migrations.sql"

echo "📁 Creating fresh output file..."
# Clear or create the output file
> "../scripts/$output_file"

echo "📂 Changing to migrations directory..."
# Change to the migrations directory
cd "$migrations_dir" || { echo "❌ Failed to change to migrations directory"; exit 1; }

echo "🔍 Finding and processing SQL files..."
# Loop through all SQL files in order
file_count=0
for file in $(ls -1 *.sql 2>/dev/null | sort); do
    if [ -f "$file" ]; then
        echo "  ↪ Processing: $file"
        file_count=$((file_count + 1))
        # Add a header for this migration
        echo -e "\n\n-- ============================================" >> "../scripts/$output_file"
        echo "-- Migration: $file" >> "../scripts/$output_file"
        echo -e "-- ============================================\n" >> "../scripts/$output_file"
        
        # Add the contents of the file
        cat "$file" >> "../scripts/$output_file"
    fi
done

echo "✅ Successfully processed $file_count migration files"
echo "📝 Combined migrations have been written to $output_file"
