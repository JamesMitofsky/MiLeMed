drop function if exists "public"."get_chapter_summary"(user_id uuid, chapter_mode mode);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_chapter_summary(user_id uuid, chapter_mode mode DEFAULT NULL::mode)
 RETURNS TABLE(id integer, title text, description text, mode mode, sort_order integer, lecture_count integer, lectures_completed integer)
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.description,
        c.mode,
        c.sort_order,
        COUNT(l.id)::INTEGER AS lecture_count,  -- Total lectures in the chapter
        COUNT(DISTINCT le.lecture_id)::INTEGER AS lectures_completed  -- Unique completed lectures
    FROM 
        chapters c
    LEFT JOIN 
        lectures l ON l.chapter_id = c.id
    LEFT JOIN 
        (
            SELECT DISTINCT lecture_id, profile_id
            FROM lecture_events
            WHERE profile_id = user_id
              AND event_type IN ('QUIZ_PASSED', 'LECTURE_SKIPPED', 'LECTURE_MARKED_AS_READ')
        ) le ON le.lecture_id = l.id  -- Only unique completed events per lecture
    WHERE 
        (chapter_mode IS NULL OR c.mode = chapter_mode)  -- Apply filter if chapter_mode is provided
    GROUP BY 
        c.id, c.title, c.description, c.mode, c.sort_order
    ORDER BY 
        c.sort_order ASC;
END;$function$
;


