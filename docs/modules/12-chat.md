# Chat / Messaging Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   └── modules/
│       ├── 00-authentication.md
│       ├── 01-tenant.md
│       ├── 02-company.md
│       ├── 03-settings.md
│       ├── 04-users.md
│       ├── 05-roles-permissions.md
│       ├── 06-task-management.md
│       ├── 07-time-tracking-global.md
│       ├── 08-time-management.md
│       ├── 09-attendance.md
│       ├── 10-payroll.md
│       ├── 11-reports.md
│       ├── 12-chat.md             ← YOU ARE HERE
│       └── 13-approval-engine.md
├── app/
│   ├── pages/
│   │   └── chat/
│   │       ├── index.vue (TODO) ← Chat list/conversations
│   │       ├── [conversationId].vue (TODO) ← Conversation view
│   │       └── direct/
│   │           └── [userId].vue (TODO) ← DM with user
│   ├── components/
│   │   └── chat/
│   │       ├── ConversationList.vue (TODO)
│   │       ├── MessageThread.vue (TODO)
│   │       ├── ChatInput.vue (TODO)
│   │       ├── UserMentionDropdown.vue (TODO)
│   │       ├── MessageReactions.vue (TODO)
│   │       └── ChatParticipants.vue (TODO)
│   ├── composables/
│   │   └── chat/
│   │       ├── useChat.ts ← Chat management
│   │       ├── useMessages.ts ← Message operations
│   │       ├── useConversations.ts ← Conversation mgmt
│   │       └── useChatNotifications.ts ← Notifications
│   ├── types/
│   │   ├── conversation.ts
│   │   ├── message.ts
│   │   └── chat-notification.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 013_create_chat_tables.sql
│   ├── routes/
│   │   └── chat/
│   │       ├── conversations.ts
│   │       ├── messages.ts
│   │       ├── participants.ts
│   │       └── reactions.ts
│   ├── services/
│   │   └── ChatService.ts ← Chat business logic
│   ├── websocket/
│   │   └── chatHandler.ts ← Real-time messaging
│   └── models/
│       ├── Conversation.ts
│       ├── ConversationParticipant.ts
│       ├── Message.ts
│       ├── MessageReaction.ts
│       └── MessageMention.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/chat/` for conversations and direct messages
- **Components**: `app/components/chat/` for conversation list, message threads, input, reactions
- **State Management**: `app/composables/chat/` for chat operations and notifications
- **Type Definitions**: `app/types/conversation.ts`, `app/types/message.ts`, `app/types/chat-notification.ts`
- **Backend**: `backend/routes/chat/` for chat APIs
- **WebSocket**: Real-time messaging using WebSocket handlers
- **Services**: ChatService for business logic

---

## 1. Purpose
Internal messaging system for company communication. Optional task-linked chat for discussing specific tasks. Enables real-time collaboration and reduces email dependence.

## 2. Routes / Pages
- `/chat` - Chat hub, conversation list
- `/chat/:conversation_id` - Conversation detail
- `/chat/direct/:user_id` - Direct message with specific user
- `/chat/search` - Search messages/conversations
- Task-linked chat: Accessible from task detail page

## 3. Actors & Roles
- **All Active Users** - Can send/receive messages, create conversations
- **Manager** - Can create group conversations for team
- **Owner** - Full access to all conversations (audit)
- **System** - Auto-creates task-linked conversations

## 4. Database Tables

### `conversations`
```
id (PK)
company_id (FK)
created_by_user_id (FK)
name (nullable) - for group chats
description (nullable)
conversation_type (direct | group | task)
task_id (FK) nullable - if task-linked
is_archived (boolean)
created_at
updated_at
```

### `conversation_participants`
```
id (PK)
conversation_id (FK)
user_id (FK)
joined_at
left_at (nullable)
role_in_conversation (member | admin) - for group chats
last_read_message_id (FK) nullable
muted (boolean)
created_at
UNIQUE(conversation_id, user_id)
```

### `messages`
```
id (PK)
conversation_id (FK)
user_id (FK)
message_text (text)
message_type (text | file | system)
attachments (JSON) - Array of file URLs, names, sizes
edited_at (timestamp) nullable
deleted_at (timestamp) nullable - soft delete
created_at
updated_at
```

### `message_reactions`
```
id (PK)
message_id (FK)
user_id (FK)
reaction (emoji: 👍, ❤️, 😂, 😢, 😡, etc.)
created_at
UNIQUE(message_id, user_id)
```

### `message_mentions`
```
id (PK)
message_id (FK)
mentioned_user_id (FK)
created_at
```

### `chat_notifications`
```
id (PK)
user_id (FK)
conversation_id (FK)
message_id (FK)
notification_type (new_message | mention | task_comment)
is_read (boolean)
created_at
```

## 5. Relationships
- `conversations.company_id` → `companies.id`
- `conversations.created_by_user_id` → `users.id`
- `conversations.task_id` → `tasks.id` (nullable)
- `conversation_participants.conversation_id` → `conversations.id`
- `conversation_participants.user_id` → `users.id`
- `messages.conversation_id` → `conversations.id`
- `messages.user_id` → `users.id`
- `message_reactions.message_id` → `messages.id`
- `message_reactions.user_id` → `users.id`
- `message_mentions.message_id` → `messages.id`
- `message_mentions.mentioned_user_id` → `users.id`
- `chat_notifications.user_id` → `users.id`
- `chat_notifications.conversation_id` → `conversations.id`
- `chat_notifications.message_id` → `messages.id`

## 6. API Endpoints

### Conversations

#### List Conversations
```
GET /api/conversations?page=1&limit=20&sort=-updated_at
Headers: Authorization: Bearer {token}
Response: {
  conversations: [
    {
      id, name, type, last_message: { text, user, created_at },
      participant_count, unread_count,
      last_updated_at
    }
  ]
}
```

#### Get Conversation Detail
```
GET /api/conversations/:id
Headers: Authorization: Bearer {token}
Response: {
  id, name, type, description,
  participants: [
    { id, name, avatar_url, online_status }
  ],
  created_at
}
```

#### Create Direct Conversation
```
POST /api/conversations/direct
Headers: Authorization: Bearer {token}
Body: {
  recipient_user_id
}
Response: {
  id, type: "direct", participants: [ ... ]
}
```

#### Create Group Conversation
```
POST /api/conversations/group
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  participant_user_ids: [1, 2, 3]
}
Response: {
  id, name, type: "group", participants: [ ... ]
}
```

#### Update Conversation
```
PUT /api/conversations/:id
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  participant_user_ids (add/remove users)
}
Response: { id, name, ... }
```

#### Archive Conversation
```
PATCH /api/conversations/:id/archive
Headers: Authorization: Bearer {token}
Response: { id, is_archived: true }
```

#### Leave Conversation
```
DELETE /api/conversations/:id/leave
Headers: Authorization: Bearer {token}
Response: { message: "Left conversation" }
```

### Messages

#### Get Messages in Conversation
```
GET /api/conversations/:id/messages?page=1&limit=50&sort=-created_at
Headers: Authorization: Bearer {token}
Response: {
  messages: [
    {
      id, user: { id, name, avatar_url }, message_text, message_type,
      attachments: [ ... ],
      created_at, edited_at,
      reactions: [
        { emoji, count, user_ids: [...] }
      ]
    }
  ],
  total_count,
  page,
  limit
}
```

#### Send Message
```
POST /api/conversations/:id/messages
Headers: Authorization: Bearer {token}
Body: {
  message_text,
  attachments: [],
  mentioned_user_ids: [5, 10] (optional for @mentions)
}
Response: {
  id, user: { id, name }, message_text,
  created_at
}
```

#### Edit Message
```
PUT /api/conversations/:id/messages/:message_id
Headers: Authorization: Bearer {token}
Body: {
  message_text
}
Response: {
  id, message_text, edited_at
}
```

#### Delete Message
```
DELETE /api/conversations/:id/messages/:message_id
Headers: Authorization: Bearer {token}
Response: {
  message: "Message deleted"
}
```

#### React to Message
```
POST /api/conversations/:id/messages/:message_id/reactions
Headers: Authorization: Bearer {token}
Body: {
  reaction: "👍" (emoji)
}
Response: {
  message_id, reaction, reactions: { emoji, count, user_ids }
}
```

#### Remove Reaction
```
DELETE /api/conversations/:id/messages/:message_id/reactions/:reaction
Headers: Authorization: Bearer {token}
Response: {
  message: "Reaction removed"
}
```

### Search

#### Search Messages
```
GET /api/chat/search?q=meeting&conversation_id=&date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  results: [
    {
      message_id, message_text, conversation_id, conversation_name,
      user: { id, name }, created_at, context: "...before message...after..."
    }
  ]
}
```

### Notifications

#### Get Chat Notifications
```
GET /api/chat/notifications?page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  notifications: [
    {
      id, conversation: { id, name }, message_preview,
      notification_type, is_read, created_at
    }
  ]
}
```

#### Mark Conversation as Read
```
PATCH /api/conversations/:id/read
Headers: Authorization: Bearer {token}
Response: {
  unread_count: 0
}
```

#### Mark Notification as Read
```
PATCH /api/chat/notifications/:id/read
Headers: Authorization: Bearer {token}
Response: { id, is_read: true }
```

#### Mute Conversation
```
PATCH /api/conversations/:id/mute
Headers: Authorization: Bearer {token}
Body: {
  duration_minutes: 60 (optional, default: forever)
}
Response: { id, muted: true }
```

#### Unmute Conversation
```
PATCH /api/conversations/:id/unmute
Headers: Authorization: Bearer {token}
Response: { id, muted: false }
```

## 7. Page Flow (Step-by-Step)

### Chat Dashboard
1. User navigates to `/chat`
2. Frontend fetches `GET /api/conversations`
3. Displays layout:

   **Left Sidebar**:
   - "New Message" button (create direct/group)
   - Search bar (search conversations/messages)
   - Conversation list:
     - Sorted by last activity
     - Shows: Conversation name, last message preview, timestamp
     - Unread badge (if any)
     - Mute/archive icons per conversation
   - Starred conversations (pinned, if implemented)

   **Right Panel** (Empty state initially):
   - "Select a conversation to start"
   - OR if conversation already selected (from URL param)
   - Show selected conversation (see below)

4. User clicks on conversation from list
5. Navigates to `/chat/:conversation_id`

### Open Conversation
1. Frontend fetches `GET /api/conversations/:id` + `GET /api/conversations/:id/messages?page=1&limit=50`
2. Displays conversation detail:

   **Header**:
   - Conversation name (or participant names for direct messages)
   - Participants list (avatars)
   - Search in conversation
   - More options (archive, leave, etc.)

   **Message Thread** (scrollable, oldest to newest):
   - Messages grouped by day/time
   - Each message shows: User avatar, Name, Timestamp, Message text
   - If edited: "edited" label
   - Message reactions shown as emoji buttons below message
   - On hover: Edit, Delete, React, Reply (if implemented)

   **Input Area**:
   - Text input field: "Type a message..."
   - @ mention support: Type @ → User list dropdown
   - Emoji picker (optional)
   - File upload button
   - Send button

3. User types message: "Let's discuss the project update"
4. User can:
   - @mention users: @john → Highlights John in dropdown → Click to mention
   - Attach file: Click attachment icon → File picker → Select file → Uploads
5. User clicks "Send" or presses Ctrl+Enter
6. Frontend sends `POST /api/conversations/:id/messages`
7. Backend creates messages row
8. Backend checks for @mentions → creates message_mentions entries
9. Backend sends notifications to mentioned users
10. Backend broadcasts message to all participants (WebSocket)
11. Frontend adds message to thread in real-time
12. Message shows with "sending..." state, then confirms

### Direct Message with User
1. User clicks "New Message" button
2. Modal opens: "Start New Conversation"
3. "Search users..." input field
4. User types name
5. Dropdown shows matching users
6. User clicks on user name
7. Frontend sends `POST /api/conversations/direct` with recipient_user_id
8. Backend:
   - Checks if direct conversation already exists between users
   - If exists: Returns existing conversation_id
   - If not: Creates new conversations row (type=direct)
   - Creates conversation_participants for both users
9. Frontend redirects to `/chat/:conversation_id`
10. Conversation opens, user can start typing

### Create Group Conversation
1. User clicks "New Message" → "New Group" (if option available)
2. Form opens:
   - Group Name (required)
   - Description (optional)
   - Add Participants: Search users, add to list
3. User fills form
4. User clicks "Create"
5. Frontend validates: name not empty, at least 1 participant
6. Frontend sends `POST /api/conversations/group`
7. Backend creates conversations row (type=group)
8. Backend creates conversation_participants entries
9. Backend sends notification to all participants: "New group created by {user}: {name}"
10. Frontend redirects to group conversation
11. Displays: "Group created. You can now chat!"

### Message Reactions
1. User hovers over message
2. Sees action icons: More options (...)
3. Clicks "React"
4. Emoji picker appears (grid of emojis)
5. User clicks emoji: 👍
6. Frontend sends `POST /api/conversations/:id/messages/:message_id/reactions` with emoji
7. Backend creates message_reactions row
8. Backend broadcasts reaction update
9. Frontend shows emoji reaction below message with count
10. If user clicks same emoji again → Removes reaction (toggle)
11. If another user adds same emoji → Count increases: "👍 2"

### Edit/Delete Message
1. User hovers over own message
2. Sees: Edit icon (pencil), Delete icon (trash)
3. User clicks Edit
4. Message becomes editable (text area)
5. User edits text
6. User presses Save or Ctrl+Enter
7. Frontend sends `PUT /api/conversations/:id/messages/:message_id`
8. Backend updates message, sets edited_at = now()
9. Frontend shows "edited" label under message
10. Other users see message updated in real-time

11. To delete: User clicks Delete
12. Confirmation: "Delete message? This cannot be undone."
13. User confirms
14. Frontend sends `DELETE /api/conversations/:id/messages/:message_id`
15. Backend soft-deletes (sets deleted_at)
16. Frontend shows: "[Message deleted]" placeholder for other users

### Search Messages
1. User navigates to `/chat/search` or clicks search icon
2. Search bar appears
3. User types keyword: "meeting"
4. Frontend sends `GET /api/chat/search?q=meeting`
5. Results show:
   - Message preview with keyword highlighted
   - Conversation name
   - User who wrote it
   - Date
6. User clicks result
7. Opens conversation + scrolls to message

### Task-Linked Chat
1. User viewing task detail page: `/task-management/tasks/:id`
2. At bottom of task detail, sees "Comments & Discussion" section
3. This is auto-linked to a conversation (created when task created)
4. User can:
   - Read existing comments
   - Add comment (sends message to task conversation)
   - @mention team members
   - React with emoji
5. Messages appear in:
   - Task detail view
   - Task-linked conversation in `/chat`
   - Both are same conversation

### Mute Conversation
1. User receives many messages in group chat
2. User right-clicks on conversation in list
3. Menu appears: "Mute for 1 hour", "Mute for 8 hours", "Mute forever"
4. User selects option
5. Frontend sends `PATCH /api/conversations/:id/mute` with duration
6. Backend updates conversation_participants.muted = true
7. Frontend hides unread badge for that conversation
8. User doesn't receive notifications, but still sees messages when opened
9. Mute can be toggled: `PATCH /api/conversations/:id/unmute`

## 8. Business Rules

### Hard Constraints
- **Message Cannot Be Empty**: Text or attachment required
- **Only Creator Can Edit/Delete**: Other users cannot modify messages
- **Participant Only**: Only conversation participants can send/read messages
- **Active User Only**: Only active users can send messages
- **Single Reaction Per User**: User can have max 1 emoji reaction per message (toggle)
- **Archives Are Read-Only**: Cannot send messages to archived conversations
- **Direct Conversation Unique**: Only one direct conversation between two users

### Soft Constraints
- Messages should be brief (< 4000 chars)
- Conversations should be organized by topic
- Old conversations can be archived periodically
- Large file attachments should be avoided (size limits)

## 9. Edge Cases

### Invalid Scenarios
- Attempt to message inactive user → Show: "User inactive, cannot message"
- Attempt to send empty message → Reject: "Message cannot be empty"
- Attempt to edit/delete other user's message → Reject: "Cannot modify other's message"
- File upload too large → Reject: "File too large (max 50MB)"
- User removed from group by admin → Cannot send messages, but can see history
- Message sent while offline → Queue locally, send when online
- Conversation deleted by admin → Archive instead of delete, keep history
- User leaves group mid-conversation → Still sees history, cannot send new messages

### Recovery Paths
- User accidentally deleted message → Contact admin to restore (if needed)
- User left group → Admin can re-add them
- File upload failed → Retry upload
- User muted by mistake → Unmute conversation

## 10. Security Notes

### Access Control
- User can only send/receive in conversations they're participant in
- Backend validates conversation membership on every message operation
- Archive/delete only by conversation creator or admin
- Direct conversation accessible only to 2 participants

### Validation
- Message text sanitized (prevent XSS)
- Attachments scanned for malware (if implemented)
- File types restricted (whitelist: doc, pdf, image, spreadsheet, etc.)
- File size limited (max 50MB per file)
- @mentions validated: user must exist + be in company

### Audit Logging
- All messages logged (for compliance)
- Message edits/deletes logged with timestamps
- File uploads logged with user, file info
- Search queries logged (for analysis)
- Retention: Keep all messages for 2+ years

### Data Privacy
- Messages not visible outside conversation
- Direct message content visible only to 2 participants
- Group message visible only to group members
- Manager cannot access employee direct messages (unless admin)
- Encrypted at rest (if sensitive)

### Rate Limiting
- User cannot send > 100 messages per minute
- File upload: max 10 uploads per user per hour
- Search: max 10 searches per minute
