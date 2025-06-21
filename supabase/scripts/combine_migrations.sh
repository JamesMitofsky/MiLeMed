#!/bin/bash
# Run from the scripts directory: chmod +x combine_migrations.sh && ./combine_migrations.sh

echo "🚀 Starting migration combination process..."

# Define paths - using absolute paths relative to the script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
migrations_dir="$PROJECT_DIR/migrations"
output_file="$SCRIPT_DIR/combined_migrations.sql"

echo "📁 Creating fresh output file..."
# Clear or create the output file
> "$output_file"

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
        echo -e "\n\n-- ============================================" >> "$output_file"
        echo "-- Migration: $file" >> "$output_file"
        echo -e "-- ============================================\n" >> "$output_file"
        
        # Add the contents of the file
        cat "$file" >> "$output_file"
    fi
done

echo "✅ Successfully processed $file_count migration files"
echo "📝 Combined migrations have been written to $(basename "$output_file")"
