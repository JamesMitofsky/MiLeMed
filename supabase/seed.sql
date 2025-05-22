INSERT INTO public.content_chapters (id,title,description,created_at,updated_at,mode,sort_order) VALUES (1, 'Chapter 1', 'Description for Chapter 1', '2025-05-22T15:42:53.624Z', NULL, 'PRACTICAL', 1), (2, 'Chapter 2', 'Description for Chapter 2', '2025-05-22T15:42:53.624Z', NULL, 'THEORETICAL', 2), (3, 'Chapter 3', 'Description for Chapter 3', '2025-05-22T15:42:53.624Z', NULL, 'PRACTICAL', 3), (4, 'Chapter 4', 'Description for Chapter 4', '2025-05-22T15:42:53.624Z', NULL, 'THEORETICAL', 4), (5, 'Chapter 5', 'Description for Chapter 5', '2025-05-22T15:42:53.624Z', NULL, 'PRACTICAL', 5);
SELECT setval('"public"."content_chapters_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."content_chapters"));
INSERT INTO public.content_lectures (id,title,content,created_at,updated_at,chapter_id,sort_order) VALUES (1, 'Lecture 1 of Chapter 1', '**Lecture 1 of Chapter 1**

This is the markdown content for Lecture 1 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 1, 1), (2, 'Lecture 2 of Chapter 1', '**Lecture 2 of Chapter 1**

This is the markdown content for Lecture 2 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 1, 2), (3, 'Lecture 3 of Chapter 1', '**Lecture 3 of Chapter 1**

This is the markdown content for Lecture 3 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 1, 3), (4, 'Lecture 1 of Chapter 2', '**Lecture 1 of Chapter 2**

This is the markdown content for Lecture 1 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 2, 1), (5, 'Lecture 2 of Chapter 2', '**Lecture 2 of Chapter 2**

This is the markdown content for Lecture 2 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 2, 2), (6, 'Lecture 3 of Chapter 2', '**Lecture 3 of Chapter 2**

This is the markdown content for Lecture 3 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 2, 3), (7, 'Lecture 1 of Chapter 3', '**Lecture 1 of Chapter 3**

This is the markdown content for Lecture 1 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 3, 1), (8, 'Lecture 2 of Chapter 3', '**Lecture 2 of Chapter 3**

This is the markdown content for Lecture 2 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 3, 2), (9, 'Lecture 3 of Chapter 3', '**Lecture 3 of Chapter 3**

This is the markdown content for Lecture 3 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 3, 3), (10, 'Lecture 1 of Chapter 4', '**Lecture 1 of Chapter 4**

This is the markdown content for Lecture 1 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 4, 1), (11, 'Lecture 2 of Chapter 4', '**Lecture 2 of Chapter 4**

This is the markdown content for Lecture 2 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 4, 2), (12, 'Lecture 3 of Chapter 4', '**Lecture 3 of Chapter 4**

This is the markdown content for Lecture 3 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 4, 3), (13, 'Lecture 1 of Chapter 5', '**Lecture 1 of Chapter 5**

This is the markdown content for Lecture 1 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 5, 1), (14, 'Lecture 2 of Chapter 5', '**Lecture 2 of Chapter 5**

This is the markdown content for Lecture 2 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 5, 2), (15, 'Lecture 3 of Chapter 5', '**Lecture 3 of Chapter 5**

This is the markdown content for Lecture 3 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2025-05-22T15:42:53.624Z', NULL, 5, 3);
SELECT setval('"public"."content_lectures_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."content_lectures"));
INSERT INTO public.quiz_questions (id,lecture_id,question_text,question_type,created_at,updated_at) VALUES (1, 1, 'Question 1 for Lecture 1 of Chapter 1', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (2, 1, 'Question 2 for Lecture 1 of Chapter 1', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (3, 2, 'Question 1 for Lecture 2 of Chapter 1', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (4, 2, 'Question 2 for Lecture 2 of Chapter 1', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (5, 3, 'Question 1 for Lecture 3 of Chapter 1', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (6, 3, 'Question 2 for Lecture 3 of Chapter 1', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (7, 4, 'Question 1 for Lecture 1 of Chapter 2', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (8, 4, 'Question 2 for Lecture 1 of Chapter 2', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (9, 5, 'Question 1 for Lecture 2 of Chapter 2', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (10, 5, 'Question 2 for Lecture 2 of Chapter 2', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (11, 6, 'Question 1 for Lecture 3 of Chapter 2', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (12, 6, 'Question 2 for Lecture 3 of Chapter 2', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (13, 7, 'Question 1 for Lecture 1 of Chapter 3', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (14, 7, 'Question 2 for Lecture 1 of Chapter 3', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (15, 8, 'Question 1 for Lecture 2 of Chapter 3', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (16, 8, 'Question 2 for Lecture 2 of Chapter 3', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (17, 9, 'Question 1 for Lecture 3 of Chapter 3', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (18, 9, 'Question 2 for Lecture 3 of Chapter 3', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (19, 10, 'Question 1 for Lecture 1 of Chapter 4', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (20, 10, 'Question 2 for Lecture 1 of Chapter 4', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (21, 11, 'Question 1 for Lecture 2 of Chapter 4', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (22, 11, 'Question 2 for Lecture 2 of Chapter 4', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (23, 12, 'Question 1 for Lecture 3 of Chapter 4', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (24, 12, 'Question 2 for Lecture 3 of Chapter 4', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (25, 13, 'Question 1 for Lecture 1 of Chapter 5', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (26, 13, 'Question 2 for Lecture 1 of Chapter 5', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (27, 14, 'Question 1 for Lecture 2 of Chapter 5', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (28, 14, 'Question 2 for Lecture 2 of Chapter 5', 'OPEN', '2025-05-22T15:42:53.624Z', NULL), (29, 15, 'Question 1 for Lecture 3 of Chapter 5', 'MULTIPLE_CHOICE', '2025-05-22T15:42:53.624Z', NULL), (30, 15, 'Question 2 for Lecture 3 of Chapter 5', 'OPEN', '2025-05-22T15:42:53.624Z', NULL);
SELECT setval('"public"."quiz_questions_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."quiz_questions"));
INSERT INTO public.quiz_options (id,question_id,option_text) VALUES (1, 1, 'Option 1 for Question 1 for Lecture 1 of Chapter 1'), (2, 1, 'Option 2 for Question 1 for Lecture 1 of Chapter 1'), (3, 1, 'Option 3 for Question 1 for Lecture 1 of Chapter 1'), (4, 1, 'Option 4 for Question 1 for Lecture 1 of Chapter 1'), (5, 2, 'The correct long answer for Question 2 for Lecture 1 of Chapter 1'), (6, 3, 'Option 1 for Question 1 for Lecture 2 of Chapter 1'), (7, 3, 'Option 2 for Question 1 for Lecture 2 of Chapter 1'), (8, 3, 'Option 3 for Question 1 for Lecture 2 of Chapter 1'), (9, 3, 'Option 4 for Question 1 for Lecture 2 of Chapter 1'), (10, 4, 'The correct long answer for Question 2 for Lecture 2 of Chapter 1'), (11, 5, 'Option 1 for Question 1 for Lecture 3 of Chapter 1'), (12, 5, 'Option 2 for Question 1 for Lecture 3 of Chapter 1'), (13, 5, 'Option 3 for Question 1 for Lecture 3 of Chapter 1'), (14, 5, 'Option 4 for Question 1 for Lecture 3 of Chapter 1'), (15, 6, 'The correct long answer for Question 2 for Lecture 3 of Chapter 1'), (16, 7, 'Option 1 for Question 1 for Lecture 1 of Chapter 2'), (17, 7, 'Option 2 for Question 1 for Lecture 1 of Chapter 2'), (18, 7, 'Option 3 for Question 1 for Lecture 1 of Chapter 2'), (19, 7, 'Option 4 for Question 1 for Lecture 1 of Chapter 2'), (20, 8, 'The correct long answer for Question 2 for Lecture 1 of Chapter 2'), (21, 9, 'Option 1 for Question 1 for Lecture 2 of Chapter 2'), (22, 9, 'Option 2 for Question 1 for Lecture 2 of Chapter 2'), (23, 9, 'Option 3 for Question 1 for Lecture 2 of Chapter 2'), (24, 9, 'Option 4 for Question 1 for Lecture 2 of Chapter 2'), (25, 10, 'The correct long answer for Question 2 for Lecture 2 of Chapter 2'), (26, 11, 'Option 1 for Question 1 for Lecture 3 of Chapter 2'), (27, 11, 'Option 2 for Question 1 for Lecture 3 of Chapter 2'), (28, 11, 'Option 3 for Question 1 for Lecture 3 of Chapter 2'), (29, 11, 'Option 4 for Question 1 for Lecture 3 of Chapter 2'), (30, 12, 'The correct long answer for Question 2 for Lecture 3 of Chapter 2'), (31, 13, 'Option 1 for Question 1 for Lecture 1 of Chapter 3'), (32, 13, 'Option 2 for Question 1 for Lecture 1 of Chapter 3'), (33, 13, 'Option 3 for Question 1 for Lecture 1 of Chapter 3'), (34, 13, 'Option 4 for Question 1 for Lecture 1 of Chapter 3'), (35, 14, 'The correct long answer for Question 2 for Lecture 1 of Chapter 3'), (36, 15, 'Option 1 for Question 1 for Lecture 2 of Chapter 3'), (37, 15, 'Option 2 for Question 1 for Lecture 2 of Chapter 3'), (38, 15, 'Option 3 for Question 1 for Lecture 2 of Chapter 3'), (39, 15, 'Option 4 for Question 1 for Lecture 2 of Chapter 3'), (40, 16, 'The correct long answer for Question 2 for Lecture 2 of Chapter 3'), (41, 17, 'Option 1 for Question 1 for Lecture 3 of Chapter 3'), (42, 17, 'Option 2 for Question 1 for Lecture 3 of Chapter 3'), (43, 17, 'Option 3 for Question 1 for Lecture 3 of Chapter 3'), (44, 17, 'Option 4 for Question 1 for Lecture 3 of Chapter 3'), (45, 18, 'The correct long answer for Question 2 for Lecture 3 of Chapter 3'), (46, 19, 'Option 1 for Question 1 for Lecture 1 of Chapter 4'), (47, 19, 'Option 2 for Question 1 for Lecture 1 of Chapter 4'), (48, 19, 'Option 3 for Question 1 for Lecture 1 of Chapter 4'), (49, 19, 'Option 4 for Question 1 for Lecture 1 of Chapter 4'), (50, 20, 'The correct long answer for Question 2 for Lecture 1 of Chapter 4'), (51, 21, 'Option 1 for Question 1 for Lecture 2 of Chapter 4'), (52, 21, 'Option 2 for Question 1 for Lecture 2 of Chapter 4'), (53, 21, 'Option 3 for Question 1 for Lecture 2 of Chapter 4'), (54, 21, 'Option 4 for Question 1 for Lecture 2 of Chapter 4'), (55, 22, 'The correct long answer for Question 2 for Lecture 2 of Chapter 4'), (56, 23, 'Option 1 for Question 1 for Lecture 3 of Chapter 4'), (57, 23, 'Option 2 for Question 1 for Lecture 3 of Chapter 4'), (58, 23, 'Option 3 for Question 1 for Lecture 3 of Chapter 4'), (59, 23, 'Option 4 for Question 1 for Lecture 3 of Chapter 4'), (60, 24, 'The correct long answer for Question 2 for Lecture 3 of Chapter 4'), (61, 25, 'Option 1 for Question 1 for Lecture 1 of Chapter 5'), (62, 25, 'Option 2 for Question 1 for Lecture 1 of Chapter 5'), (63, 25, 'Option 3 for Question 1 for Lecture 1 of Chapter 5'), (64, 25, 'Option 4 for Question 1 for Lecture 1 of Chapter 5'), (65, 26, 'The correct long answer for Question 2 for Lecture 1 of Chapter 5'), (66, 27, 'Option 1 for Question 1 for Lecture 2 of Chapter 5'), (67, 27, 'Option 2 for Question 1 for Lecture 2 of Chapter 5'), (68, 27, 'Option 3 for Question 1 for Lecture 2 of Chapter 5'), (69, 27, 'Option 4 for Question 1 for Lecture 2 of Chapter 5'), (70, 28, 'The correct long answer for Question 2 for Lecture 2 of Chapter 5'), (71, 29, 'Option 1 for Question 1 for Lecture 3 of Chapter 5'), (72, 29, 'Option 2 for Question 1 for Lecture 3 of Chapter 5'), (73, 29, 'Option 3 for Question 1 for Lecture 3 of Chapter 5'), (74, 29, 'Option 4 for Question 1 for Lecture 3 of Chapter 5'), (75, 30, 'The correct long answer for Question 2 for Lecture 3 of Chapter 5');
SELECT setval('"public"."quiz_options_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."quiz_options"));
