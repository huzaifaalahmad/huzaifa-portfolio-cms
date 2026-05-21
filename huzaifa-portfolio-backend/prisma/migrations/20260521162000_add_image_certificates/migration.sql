INSERT INTO `certifications` (`id`, `name`, `issuer`, `issue_date`, `credential_url`, `is_visible`, `order`, `created_at`, `updated_at`) VALUES
('cert-german-board-appreciation', 'Certificate of Appreciation', 'German Board for Training and Consulting', 'Aug 24, 2025', '/assets/certificates/german-board-appreciation.jpg', true, 20, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-iecd-web-design-training', 'Web Design Training Course (60 hrs)', 'IECD Impact Youth Center', 'Sep 18, 2022', '/assets/certificates/iecd-web-design-training.jpg', true, 21, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-one-million-prompters', 'One Million Prompters', 'Dubai Future Foundation / Dubai Centre for AI', '2025', '/assets/certificates/one-million-prompters.jpg', true, 22, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-projects-sy-adobe-package', 'Adobe Package (Photoshop, Illustrator)', 'Projects SY International', 'Feb 29, 2024', '/assets/certificates/projects-sy-adobe-package.jpg', true, 23, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `issuer` = VALUES(`issuer`),
  `issue_date` = VALUES(`issue_date`),
  `credential_url` = VALUES(`credential_url`),
  `is_visible` = VALUES(`is_visible`),
  `order` = VALUES(`order`),
  `deleted_at` = NULL,
  `updated_at` = CURRENT_TIMESTAMP(3);
