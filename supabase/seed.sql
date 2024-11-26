INSERT INTO public.chapters (id,title,description,created_at,updated_at,mode,sort_order) VALUES (1, 'Chapter 1', 'Description for Chapter 1', '2024-11-26T10:36:15.884Z', NULL, 'PRACTICAL', 1), (2, 'Chapter 2', 'Description for Chapter 2', '2024-11-26T10:36:15.884Z', NULL, 'THEORETICAL', 2), (3, 'Chapter 3', 'Description for Chapter 3', '2024-11-26T10:36:15.884Z', NULL, 'PRACTICAL', 3), (4, 'Chapter 4', 'Description for Chapter 4', '2024-11-26T10:36:15.884Z', NULL, 'THEORETICAL', 4), (5, 'Chapter 5', 'Description for Chapter 5', '2024-11-26T10:36:15.884Z', NULL, 'PRACTICAL', 5);
SELECT setval('"public"."chapters_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."chapters"));
INSERT INTO public.lectures (id,title,content,created_at,updated_at,chapter_id,sort_order) VALUES (1, 'Lecture 1 of Chapter 1', '**Lecture 1 of Chapter 1**

This is the markdown content for Lecture 1 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 1, 1), (2, 'Lecture 2 of Chapter 1', '**Lecture 2 of Chapter 1**

This is the markdown content for Lecture 2 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 1, 2), (3, 'Lecture 3 of Chapter 1', '**Lecture 3 of Chapter 1**

This is the markdown content for Lecture 3 in Chapter 1.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 1, 3), (4, 'Lecture 1 of Chapter 2', '**Lecture 1 of Chapter 2**

This is the markdown content for Lecture 1 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 2, 1), (5, 'Lecture 2 of Chapter 2', '**Lecture 2 of Chapter 2**

This is the markdown content for Lecture 2 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 2, 2), (6, 'Lecture 3 of Chapter 2', '**Lecture 3 of Chapter 2**

This is the markdown content for Lecture 3 in Chapter 2.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 2, 3), (7, 'Lecture 1 of Chapter 3', '**Lecture 1 of Chapter 3**

This is the markdown content for Lecture 1 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 3, 1), (8, 'Lecture 2 of Chapter 3', '**Lecture 2 of Chapter 3**

This is the markdown content for Lecture 2 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 3, 2), (9, 'Lecture 3 of Chapter 3', '**Lecture 3 of Chapter 3**

This is the markdown content for Lecture 3 in Chapter 3.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 3, 3), (10, 'Lecture 1 of Chapter 4', '**Lecture 1 of Chapter 4**

This is the markdown content for Lecture 1 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 4, 1), (11, 'Lecture 2 of Chapter 4', '**Lecture 2 of Chapter 4**

This is the markdown content for Lecture 2 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.884Z', NULL, 4, 2), (12, 'Lecture 3 of Chapter 4', '**Lecture 3 of Chapter 4**

This is the markdown content for Lecture 3 in Chapter 4.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.885Z', NULL, 4, 3), (13, 'Lecture 1 of Chapter 5', '**Lecture 1 of Chapter 5**

This is the markdown content for Lecture 1 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.885Z', NULL, 5, 1), (14, 'Lecture 2 of Chapter 5', '**Lecture 2 of Chapter 5**

This is the markdown content for Lecture 2 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.885Z', NULL, 5, 2), (15, 'Lecture 3 of Chapter 5', '**Lecture 3 of Chapter 5**

This is the markdown content for Lecture 3 in Chapter 5.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( https://picsum.photos/200/300 )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.', '2024-11-26T10:36:15.885Z', NULL, 5, 3);
SELECT setval('"public"."lectures_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."lectures"));
