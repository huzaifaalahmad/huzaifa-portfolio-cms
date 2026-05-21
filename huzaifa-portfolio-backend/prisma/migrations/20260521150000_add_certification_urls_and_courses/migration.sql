ALTER TABLE `certifications` ADD COLUMN `credential_url` VARCHAR(191) NULL;

UPDATE `certifications`
SET `deleted_at` = CURRENT_TIMESTAMP(3), `is_visible` = false
WHERE `name` IN ('AI Prompt Engineering Practice', 'Full-Stack Development Projects');

INSERT INTO `certifications` (`id`, `name`, `issuer`, `issue_date`, `credential_url`, `is_visible`, `order`, `created_at`, `updated_at`) VALUES
('cert-claude-with-anthropic-api', 'Claude with the Anthropic API', 'Anthropic', 'May 1, 2026', '/assets/certificates/claude-with-anthropic-api.pdf', true, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-introduction-to-model-context-protocol', 'Introduction to Model Context Protocol', 'Anthropic', 'May 1, 2026', '/assets/certificates/introduction-to-model-context-protocol.pdf', true, 2, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-ai-fluency-for-students', 'AI Fluency for students', 'Anthropic', 'May 1, 2026', '/assets/certificates/ai-fluency-for-students.pdf', true, 3, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-ai-fluency-for-nonprofits', 'AI Fluency for nonprofits', 'Anthropic / GivingTuesday', 'May 1, 2026', '/assets/certificates/ai-fluency-for-nonprofits.pdf', true, 4, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-introduction-to-agent-skills', 'Introduction to agent skills', 'Anthropic', 'May 1, 2026', '/assets/certificates/introduction-to-agent-skills.pdf', true, 5, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-introduction-to-claude-cowork', 'Introduction to Claude Cowork', 'Anthropic', 'April 30, 2026', '/assets/certificates/introduction-to-claude-cowork.pdf', true, 6, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-ai-capabilities-and-limitations', 'AI Fluency: AI Capabilities & Limitations', 'Anthropic', 'May 1, 2026', '/assets/certificates/ai-fluency-ai-capabilities-and-limitations.pdf', true, 7, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-generative-ai-content-creation', 'Generative AI Content Creation', 'Adobe / Coursera', 'Apr 23, 2025', '/assets/certificates/generative-ai-content-creation.pdf', true, 8, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-design-fundamentals', 'Design Fundamentals', 'Adobe / Coursera', 'Feb 27, 2025', '/assets/certificates/design-fundamentals.pdf', true, 9, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-claude-code-in-action', 'Claude Code in Action', 'Anthropic', 'May 1, 2026', '/assets/certificates/claude-code-in-action.pdf', true, 10, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-teaching-the-ai-fluency-framework', 'Teaching the AI Fluency Framework', 'Anthropic / UCC', 'May 1, 2026', '/assets/certificates/teaching-the-ai-fluency-framework.pdf', true, 11, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-claude-101', 'Claude 101', 'Anthropic', 'April 30, 2026', '/assets/certificates/claude-101.pdf', true, 12, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-ai-framework-and-foundations', 'AI Fluency: Framework & Foundations', 'Anthropic / UCC', 'May 1, 2026', '/assets/certificates/ai-fluency-framework-and-foundations.pdf', true, 13, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-claude-code-101', 'Claude Code 101', 'Anthropic', 'April 30, 2026', '/assets/certificates/claude-code-101.pdf', true, 14, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-claude-with-amazon-bedrock', 'Claude with Amazon Bedrock', 'Anthropic', 'May 1, 2026', '/assets/certificates/claude-with-amazon-bedrock.pdf', true, 15, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-model-context-protocol-advanced-topics', 'Model Context Protocol: Advanced Topics', 'Anthropic', 'May 1, 2026', '/assets/certificates/model-context-protocol-advanced-topics.pdf', true, 16, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-introduction-to-subagents', 'Introduction to subagents', 'Anthropic', 'May 1, 2026', '/assets/certificates/introduction-to-subagents.pdf', true, 17, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-ai-fluency-for-educators', 'AI Fluency for educators', 'Anthropic / UCC', 'May 1, 2026', '/assets/certificates/ai-fluency-for-educators.pdf', true, 18, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('cert-claude-with-google-vertex-ai', 'Claude with Google Vertex AI', 'Anthropic', 'May 1, 2026', '/assets/certificates/claude-with-google-vertex-ai.pdf', true, 19, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `issuer` = VALUES(`issuer`),
  `issue_date` = VALUES(`issue_date`),
  `credential_url` = VALUES(`credential_url`),
  `is_visible` = VALUES(`is_visible`),
  `order` = VALUES(`order`),
  `deleted_at` = NULL,
  `updated_at` = CURRENT_TIMESTAMP(3);
