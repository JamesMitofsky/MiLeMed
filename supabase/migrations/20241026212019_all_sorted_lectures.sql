CREATE VIEW all_sorted_lectures AS
SELECT 
    l.id AS lecture_id,
    l.title AS lecture_title,
    l.content AS lecture_content,
    l.sort_order AS lecture_sort_order,
    l.chapter_id AS chapter_id,
    c.sort_order AS chapter_sort_order
FROM 
    lectures l
JOIN 
    chapters c ON l.chapter_id = c.id
ORDER BY 
    c.sort_order ASC, 
    l.sort_order ASC;
