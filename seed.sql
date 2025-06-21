INSERT INTO public.chapters (id,title,description,created_at,updated_at,mode,sort_order) VALUES (1, 'Chapter 1', 'Description for Chapter 1', '2024-11-27T10:40:29.347Z', NULL, 'PRACTICAL', 1), (2, 'Chapter 2', 'Description for Chapter 2', '2024-11-27T10:40:29.348Z', NULL, 'THEORETICAL', 2), (3, 'Chapter 3', 'Description for Chapter 3', '2024-11-27T10:40:29.348Z', NULL, 'PRACTICAL', 3), (4, 'Chapter 4', 'Description for Chapter 4', '2024-11-27T10:40:29.348Z', NULL, 'THEORETICAL', 4), (5, 'Chapter 5', 'Description for Chapter 5', '2024-11-27T10:40:29.348Z', NULL, 'PRACTICAL', 5);
SELECT setval('"public"."chapters_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."chapters"));
INSERT INTO public.lectures (id,title,content,created_at,updated_at,chapter_id,sort_order) VALUES (1, 'Lecture 1 of Chapter 1', '**Lecture 1 of Chapter 1**

This is the markdown content for Lecture 1 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 1, 1), (2, 'Lecture 2 of Chapter 1', '**Lecture 2 of Chapter 1**

This is the markdown content for Lecture 2 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 1, 2), (3, 'Lecture 3 of Chapter 1', '**Lecture 3 of Chapter 1**

This is the markdown content for Lecture 3 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 1, 3), (4, 'Lecture 1 of Chapter 2', '**Lecture 1 of Chapter 2**

This is the markdown content for Lecture 1 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 2, 1), (5, 'Lecture 2 of Chapter 2', '**Lecture 2 of Chapter 2**

This is the markdown content for Lecture 2 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 2, 2), (6, 'Lecture 3 of Chapter 2', '**Lecture 3 of Chapter 2**

This is the markdown content for Lecture 3 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 2, 3), (7, 'Lecture 1 of Chapter 3', '**Lecture 1 of Chapter 3**

This is the markdown content for Lecture 1 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 3, 1), (8, 'Lecture 2 of Chapter 3', '**Lecture 2 of Chapter 3**

This is the markdown content for Lecture 2 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 3, 2), (9, 'Lecture 3 of Chapter 3', '**Lecture 3 of Chapter 3**

This is the markdown content for Lecture 3 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 3, 3), (10, 'Lecture 1 of Chapter 4', '**Lecture 1 of Chapter 4**

This is the markdown content for Lecture 1 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 4, 1), (11, 'Lecture 2 of Chapter 4', '**Lecture 2 of Chapter 4**

This is the markdown content for Lecture 2 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 4, 2), (12, 'Lecture 3 of Chapter 4', '**Lecture 3 of Chapter 4**

This is the markdown content for Lecture 3 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 4, 3), (13, 'Lecture 1 of Chapter 5', '**Lecture 1 of Chapter 5**

This is the markdown content for Lecture 1 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 5, 1), (14, 'Lecture 2 of Chapter 5', '**Lecture 2 of Chapter 5**

This is the markdown content for Lecture 2 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 5, 2), (15, 'Lecture 3 of Chapter 5', '**Lecture 3 of Chapter 5**

This is the markdown content for Lecture 3 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-27T10:40:29.348Z', NULL, 5, 3);
SELECT setval('"public"."lectures_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."lectures"));
INSERT INTO public.quiz_questions (id,lecture_id,question_text,question_type,created_at,updated_at) VALUES (1, 1, 'Question 1 for Lecture 1 of Chapter 1', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (2, 1, 'Question 2 for Lecture 1 of Chapter 1', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (3, 2, 'Question 1 for Lecture 2 of Chapter 1', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (4, 2, 'Question 2 for Lecture 2 of Chapter 1', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (5, 3, 'Question 1 for Lecture 3 of Chapter 1', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (6, 3, 'Question 2 for Lecture 3 of Chapter 1', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (7, 4, 'Question 1 for Lecture 1 of Chapter 2', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (8, 4, 'Question 2 for Lecture 1 of Chapter 2', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (9, 5, 'Question 1 for Lecture 2 of Chapter 2', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (10, 5, 'Question 2 for Lecture 2 of Chapter 2', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (11, 6, 'Question 1 for Lecture 3 of Chapter 2', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (12, 6, 'Question 2 for Lecture 3 of Chapter 2', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (13, 7, 'Question 1 for Lecture 1 of Chapter 3', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (14, 7, 'Question 2 for Lecture 1 of Chapter 3', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (15, 8, 'Question 1 for Lecture 2 of Chapter 3', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (16, 8, 'Question 2 for Lecture 2 of Chapter 3', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (17, 9, 'Question 1 for Lecture 3 of Chapter 3', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (18, 9, 'Question 2 for Lecture 3 of Chapter 3', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (19, 10, 'Question 1 for Lecture 1 of Chapter 4', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (20, 10, 'Question 2 for Lecture 1 of Chapter 4', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (21, 11, 'Question 1 for Lecture 2 of Chapter 4', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (22, 11, 'Question 2 for Lecture 2 of Chapter 4', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (23, 12, 'Question 1 for Lecture 3 of Chapter 4', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (24, 12, 'Question 2 for Lecture 3 of Chapter 4', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (25, 13, 'Question 1 for Lecture 1 of Chapter 5', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (26, 13, 'Question 2 for Lecture 1 of Chapter 5', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (27, 14, 'Question 1 for Lecture 2 of Chapter 5', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (28, 14, 'Question 2 for Lecture 2 of Chapter 5', 'OPEN', '2024-11-27T10:40:29.348Z', NULL), (29, 15, 'Question 1 for Lecture 3 of Chapter 5', 'MULTIPLE_CHOICE', '2024-11-27T10:40:29.348Z', NULL), (30, 15, 'Question 2 for Lecture 3 of Chapter 5', 'OPEN', '2024-11-27T10:40:29.348Z', NULL);
SELECT setval('"public"."quiz_questions_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."quiz_questions"));
INSERT INTO public.quiz_question_options (id,question_id,option_text,is_correct,updated_at) VALUES (1, 1, 'Option 1 for Question 1 for Lecture 1 of Chapter 1', 'f', NULL), (2, 1, 'Option 2 for Question 1 for Lecture 1 of Chapter 1', 'f', NULL), (3, 1, 'Option 3 for Question 1 for Lecture 1 of Chapter 1', 't', NULL), (4, 1, 'Option 4 for Question 1 for Lecture 1 of Chapter 1', 'f', NULL), (5, 2, 'The correct long answer for Question 2 for Lecture 1 of Chapter 1', 't', NULL), (6, 3, 'Option 1 for Question 1 for Lecture 2 of Chapter 1', 't', NULL), (7, 3, 'Option 2 for Question 1 for Lecture 2 of Chapter 1', 'f', NULL), (8, 3, 'Option 3 for Question 1 for Lecture 2 of Chapter 1', 'f', NULL), (9, 3, 'Option 4 for Question 1 for Lecture 2 of Chapter 1', 'f', NULL), (10, 4, 'The correct long answer for Question 2 for Lecture 2 of Chapter 1', 't', NULL), (11, 5, 'Option 1 for Question 1 for Lecture 3 of Chapter 1', 'f', NULL), (12, 5, 'Option 2 for Question 1 for Lecture 3 of Chapter 1', 'f', NULL), (13, 5, 'Option 3 for Question 1 for Lecture 3 of Chapter 1', 'f', NULL), (14, 5, 'Option 4 for Question 1 for Lecture 3 of Chapter 1', 't', NULL), (15, 6, 'The correct long answer for Question 2 for Lecture 3 of Chapter 1', 't', NULL), (16, 7, 'Option 1 for Question 1 for Lecture 1 of Chapter 2', 'f', NULL), (17, 7, 'Option 2 for Question 1 for Lecture 1 of Chapter 2', 'f', NULL), (18, 7, 'Option 3 for Question 1 for Lecture 1 of Chapter 2', 'f', NULL), (19, 7, 'Option 4 for Question 1 for Lecture 1 of Chapter 2', 't', NULL), (20, 8, 'The correct long answer for Question 2 for Lecture 1 of Chapter 2', 't', NULL), (21, 9, 'Option 1 for Question 1 for Lecture 2 of Chapter 2', 'f', NULL), (22, 9, 'Option 2 for Question 1 for Lecture 2 of Chapter 2', 'f', NULL), (23, 9, 'Option 3 for Question 1 for Lecture 2 of Chapter 2', 'f', NULL), (24, 9, 'Option 4 for Question 1 for Lecture 2 of Chapter 2', 't', NULL), (25, 10, 'The correct long answer for Question 2 for Lecture 2 of Chapter 2', 't', NULL), (26, 11, 'Option 1 for Question 1 for Lecture 3 of Chapter 2', 't', NULL), (27, 11, 'Option 2 for Question 1 for Lecture 3 of Chapter 2', 'f', NULL), (28, 11, 'Option 3 for Question 1 for Lecture 3 of Chapter 2', 'f', NULL), (29, 11, 'Option 4 for Question 1 for Lecture 3 of Chapter 2', 'f', NULL), (30, 12, 'The correct long answer for Question 2 for Lecture 3 of Chapter 2', 't', NULL), (31, 13, 'Option 1 for Question 1 for Lecture 1 of Chapter 3', 'f', NULL), (32, 13, 'Option 2 for Question 1 for Lecture 1 of Chapter 3', 'f', NULL), (33, 13, 'Option 3 for Question 1 for Lecture 1 of Chapter 3', 't', NULL), (34, 13, 'Option 4 for Question 1 for Lecture 1 of Chapter 3', 'f', NULL), (35, 14, 'The correct long answer for Question 2 for Lecture 1 of Chapter 3', 't', NULL), (36, 15, 'Option 1 for Question 1 for Lecture 2 of Chapter 3', 't', NULL), (37, 15, 'Option 2 for Question 1 for Lecture 2 of Chapter 3', 'f', NULL), (38, 15, 'Option 3 for Question 1 for Lecture 2 of Chapter 3', 'f', NULL), (39, 15, 'Option 4 for Question 1 for Lecture 2 of Chapter 3', 'f', NULL), (40, 16, 'The correct long answer for Question 2 for Lecture 2 of Chapter 3', 't', NULL), (41, 17, 'Option 1 for Question 1 for Lecture 3 of Chapter 3', 'f', NULL), (42, 17, 'Option 2 for Question 1 for Lecture 3 of Chapter 3', 't', NULL), (43, 17, 'Option 3 for Question 1 for Lecture 3 of Chapter 3', 'f', NULL), (44, 17, 'Option 4 for Question 1 for Lecture 3 of Chapter 3', 'f', NULL), (45, 18, 'The correct long answer for Question 2 for Lecture 3 of Chapter 3', 't', NULL), (46, 19, 'Option 1 for Question 1 for Lecture 1 of Chapter 4', 'f', NULL), (47, 19, 'Option 2 for Question 1 for Lecture 1 of Chapter 4', 'f', NULL), (48, 19, 'Option 3 for Question 1 for Lecture 1 of Chapter 4', 'f', NULL), (49, 19, 'Option 4 for Question 1 for Lecture 1 of Chapter 4', 't', NULL), (50, 20, 'The correct long answer for Question 2 for Lecture 1 of Chapter 4', 't', NULL), (51, 21, 'Option 1 for Question 1 for Lecture 2 of Chapter 4', 't', NULL), (52, 21, 'Option 2 for Question 1 for Lecture 2 of Chapter 4', 'f', NULL), (53, 21, 'Option 3 for Question 1 for Lecture 2 of Chapter 4', 'f', NULL), (54, 21, 'Option 4 for Question 1 for Lecture 2 of Chapter 4', 'f', NULL), (55, 22, 'The correct long answer for Question 2 for Lecture 2 of Chapter 4', 't', NULL), (56, 23, 'Option 1 for Question 1 for Lecture 3 of Chapter 4', 'f', NULL), (57, 23, 'Option 2 for Question 1 for Lecture 3 of Chapter 4', 't', NULL), (58, 23, 'Option 3 for Question 1 for Lecture 3 of Chapter 4', 'f', NULL), (59, 23, 'Option 4 for Question 1 for Lecture 3 of Chapter 4', 'f', NULL), (60, 24, 'The correct long answer for Question 2 for Lecture 3 of Chapter 4', 't', NULL), (61, 25, 'Option 1 for Question 1 for Lecture 1 of Chapter 5', 'f', NULL), (62, 25, 'Option 2 for Question 1 for Lecture 1 of Chapter 5', 't', NULL), (63, 25, 'Option 3 for Question 1 for Lecture 1 of Chapter 5', 'f', NULL), (64, 25, 'Option 4 for Question 1 for Lecture 1 of Chapter 5', 'f', NULL), (65, 26, 'The correct long answer for Question 2 for Lecture 1 of Chapter 5', 't', NULL), (66, 27, 'Option 1 for Question 1 for Lecture 2 of Chapter 5', 'f', NULL), (67, 27, 'Option 2 for Question 1 for Lecture 2 of Chapter 5', 't', NULL), (68, 27, 'Option 3 for Question 1 for Lecture 2 of Chapter 5', 'f', NULL), (69, 27, 'Option 4 for Question 1 for Lecture 2 of Chapter 5', 'f', NULL), (70, 28, 'The correct long answer for Question 2 for Lecture 2 of Chapter 5', 't', NULL), (71, 29, 'Option 1 for Question 1 for Lecture 3 of Chapter 5', 'f', NULL), (72, 29, 'Option 2 for Question 1 for Lecture 3 of Chapter 5', 't', NULL), (73, 29, 'Option 3 for Question 1 for Lecture 3 of Chapter 5', 'f', NULL), (74, 29, 'Option 4 for Question 1 for Lecture 3 of Chapter 5', 'f', NULL), (75, 30, 'The correct long answer for Question 2 for Lecture 3 of Chapter 5', 't', NULL);
SELECT setval('"public"."quiz_question_options_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."quiz_question_options"));
