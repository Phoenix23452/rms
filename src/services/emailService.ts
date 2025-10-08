// src/lib/mock/email-campaigns.ts

export interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  recipients: number;
  status: "draft" | "scheduled" | "sent";
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  type: string;
  status: string;
  error: string | null;
  created_at: string;
}

// In-memory mock data
let mockEmailCampaigns: EmailCampaign[] = [
  {
    id: "camp-1",
    subject: "Welcome to Our Service!",
    content: "Hello, thank you for joining us...",
    recipients: 1200,
    status: "sent",
    sent_at: "2025-09-01T12:00:00Z",
    created_at: "2025-08-20T10:00:00Z",
    updated_at: "2025-08-25T11:00:00Z",
  },
  {
    id: "camp-2",
    subject: "Upcoming Sale Announcement",
    content: "Get ready for our big sale...",
    recipients: 1500,
    status: "draft",
    sent_at: null,
    created_at: "2025-09-10T09:30:00Z",
    updated_at: "2025-09-10T09:30:00Z",
  },
];

// Utility delay to simulate async behavior
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Generate a random ID string
const generateId = () => `camp-${Math.random().toString(36).substring(2, 9)}`;

// Fetch all email campaigns (descending by created_at)
export const fetchEmailCampaigns = async (): Promise<EmailCampaign[]> => {
  console.log("📧 [Mock] fetchEmailCampaigns called");
  await delay(300);
  // Return copy sorted by created_at desc
  return [...mockEmailCampaigns].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
};

// Create a new email campaign
export const createEmailCampaign = async (
  campaign: Omit<EmailCampaign, "id" | "created_at" | "updated_at">,
): Promise<EmailCampaign> => {
  console.log("📧 [Mock] createEmailCampaign called with:", campaign);
  await delay(300);

  const newCampaign: EmailCampaign = {
    id: generateId(),
    subject: campaign.subject,
    content: campaign.content,
    recipients: campaign.recipients,
    status: campaign.status,
    sent_at: campaign.sent_at,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockEmailCampaigns.push(newCampaign);
  return newCampaign;
};
