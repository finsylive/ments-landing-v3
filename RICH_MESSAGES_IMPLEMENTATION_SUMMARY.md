# Rich Message Types - Implementation Summary

**Quick Reference Guide for Next.js Team**

## Overview

This feature allows users to share posts and profiles as rich, interactive cards within chat messages. Think Instagram/WhatsApp-style sharing but for posts and user profiles.

---

## 🎯 Key Features

1. **Share Posts in Chat** - Users can share any post from the feed as a rich preview card
2. **Share Profiles in Chat** - Users can share user profiles as interactive cards
3. **Instagram-Style Share Sheet** - Beautiful bottom sheet for selecting multiple recipients
4. **Tap to View** - Click on shared content to view the full post/profile
5. **Real-time Delivery** - Messages appear instantly via Supabase real-time

---

## 📊 Database Changes

### New Columns in `messages` Table

```sql
ALTER TABLE messages ADD COLUMN message_type TEXT DEFAULT 'text';
ALTER TABLE messages ADD COLUMN metadata JSONB;
```

### Message Types Supported

| Type | DB Value | Status |
|------|----------|--------|
| Text | `text` | ✅ Live |
| Post Share | `post_share` | ✅ Live |
| Profile Share | `profile_share` | ✅ Live |
| Voice Note | `voice_note` | 🚧 Future |
| Image | `image` | 🚧 Future |
| Video | `video` | 🚧 Future |
| File | `file` | 🚧 Future |

---

## 🔑 Key Data Structures

### Post Share Message

```json
{
  "message_type": "post_share",
  "content": "Shared a post",
  "metadata": {
    "version": 1,
    "post_id": "uuid-here",
    "author_name": "John Doe",
    "author_username": "johndoe",
    "author_avatar_url": "path/to/avatar.jpg",
    "is_author_verified": true,
    "content": "Post preview text...",
    "post_type": "media",
    "media_thumbnail_url": "path/to/thumbnail.jpg",
    "media_count": 3,
    "created_at": "2025-10-05T10:30:00Z",
    "environment_name": "Technology",
    "poll_question": null,
    "poll_options": null
  }
}
```

### Profile Share Message

```json
{
  "message_type": "profile_share",
  "content": "Shared a profile",
  "metadata": {
    "version": 1,
    "user_id": "uuid-here",
    "username": "janedoe",
    "full_name": "Jane Doe",
    "avatar_url": "path/to/avatar.jpg",
    "tagline": "Product Designer | UX Enthusiast",
    "user_type": "mentor",
    "is_verified": true,
    "current_city": "San Francisco"
  }
}
```

---

## 🚀 Implementation Steps

### 1. Database Migration

```sql
-- Run this migration first
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS metadata JSONB;

ALTER TABLE messages ADD CONSTRAINT messages_message_type_check
CHECK (message_type IN ('text', 'post_share', 'profile_share', 'voice_note', 'image', 'video', 'file'));

CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_metadata_gin ON messages USING GIN (metadata);
```

### 2. TypeScript Types

```typescript
export enum MessageType {
  TEXT = 'text',
  POST_SHARE = 'post_share',
  PROFILE_SHARE = 'profile_share',
  // ... others
}

export interface PostShareMetadata {
  version: number;
  post_id: string;
  author_name?: string;
  author_username?: string;
  author_avatar_url?: string;
  is_author_verified?: boolean;
  content?: string;
  post_type?: 'text' | 'media' | 'poll';
  media_thumbnail_url?: string;
  media_count?: number;
  created_at?: string;
  environment_name?: string;
  poll_question?: string;
  poll_options?: string[];
}

export interface ProfileShareMetadata {
  version: number;
  user_id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  tagline?: string;
  user_type?: 'mentor' | 'normal_user';
  is_verified?: boolean;
  current_city?: string;
}
```

### 3. Sending a Message (API)

```typescript
import { supabase } from '@/lib/supabase';

async function sharePostInChat(conversationId: string, post: Post) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: 'Shared a post',
      message_type: 'post_share',
      metadata: {
        version: 1,
        post_id: post.id,
        author_name: post.author_name,
        author_username: post.author_username,
        author_avatar_url: post.author_avatar_url,
        is_author_verified: post.is_author_verified,
        content: post.content,
        post_type: post.post_type,
        media_thumbnail_url: post.media?.[0]?.media_url,
        media_count: post.media?.length,
        created_at: post.created_at,
        environment_name: post.environment_name,
        poll_question: post.poll?.question,
        poll_options: post.poll?.options.map(o => o.option_text)
      },
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  // Update conversation timestamp
  await supabase
    .from('conversations')
    .update({
      last_message: 'Shared a post',
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  return data;
}
```

### 4. Message Bubble Component (React)

```tsx
export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  switch (message.message_type) {
    case MessageType.POST_SHARE:
      return (
        <PostShareBubble
          metadata={message.metadata as PostShareMetadata}
          isMe={isMe}
          onClick={() => router.push(`/post/${message.metadata.post_id}`)}
        />
      );

    case MessageType.PROFILE_SHARE:
      return (
        <ProfileShareBubble
          metadata={message.metadata as ProfileShareMetadata}
          isMe={isMe}
          onClick={() => router.push(`/profile/${message.metadata.user_id}`)}
        />
      );

    case MessageType.TEXT:
    default:
      return <TextMessageBubble content={message.content} isMe={isMe} />;
  }
}
```

### 5. Post Share Bubble UI

```tsx
export function PostShareBubble({ metadata, onClick }: Props) {
  return (
    <div className="w-[280px] rounded-xl border bg-gray-800/15 cursor-pointer" onClick={onClick}>
      {/* Header with author info */}
      <div className="p-3 flex items-center gap-2">
        <img src={metadata.author_avatar_url} className="w-7 h-7 rounded-full" />
        <div>
          <p className="text-sm font-semibold">{metadata.author_name}</p>
          <p className="text-xs text-gray-500">@{metadata.author_username}</p>
        </div>
      </div>

      {/* Post content preview */}
      {metadata.content && (
        <p className="px-3 pb-2 text-sm line-clamp-3">{metadata.content}</p>
      )}

      {/* Media thumbnail */}
      {metadata.media_thumbnail_url && (
        <img src={metadata.media_thumbnail_url} className="mx-3 mb-2 h-44 rounded-lg" />
      )}

      {/* Footer */}
      <div className="px-3 py-2 border-t flex justify-between">
        {metadata.environment_name && (
          <span className="px-2 py-0.5 bg-green-500/15 text-green-500 text-xs rounded">
            {metadata.environment_name}
          </span>
        )}
        <span className="text-xs text-green-500">Tap to view</span>
      </div>
    </div>
  );
}
```

### 6. Instagram Share Sheet

```tsx
export function InstagramShareSheet({ post, open, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState([]);

  async function handleSend() {
    for (const convId of selected) {
      await sharePostInChat(convId, post);
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2>Send to</h2>

        <Input placeholder="Search" onChange={handleSearch} />

        <div className="grid grid-cols-3 gap-4">
          {conversations.map(conv => (
            <PersonTile
              key={conv.id}
              user={conv.other_user}
              selected={selected.has(conv.id)}
              onToggle={() => toggleSelection(conv.id)}
            />
          ))}
        </div>

        {selected.size > 0 && (
          <Button onClick={handleSend}>Send to {selected.size} people</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### 7. Real-time Subscriptions

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [conversationId]);
```

---

## 🔒 Security (RLS Policies)

```sql
-- Messages RLS
CREATE POLICY "Users can view messages in own conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE id = conversation_id
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in own conversations"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE id = conversation_id
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);
```

---

## ⚠️ Error Handling

### Deleted/Missing Content

```typescript
async function handlePostClick(postId: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('deleted', false)
      .maybeSingle();

    if (!data) {
      toast.error('This post is no longer available');
      return;
    }

    router.push(`/post/${postId}`);
  } catch (error) {
    toast.error('Failed to load post');
  }
}
```

### Unsupported Message Types

```tsx
function UnsupportedMessageBubble({ type }: { type: MessageType }) {
  return (
    <div className="p-3 bg-gray-800/10 rounded-lg">
      <p className="text-sm">Unsupported Message</p>
      <p className="text-xs text-gray-500">
        This message type ({type}) is not supported in web yet.
      </p>
    </div>
  );
}
```

---

## 📈 Performance Best Practices

1. **Metadata Size**: Keep under 10KB per message
2. **Image URLs**: Store thumbnails, not full-size images in metadata
3. **Pagination**: Load 20 messages at a time
4. **Caching**: Use React Query or SWR for shared content
5. **Lazy Loading**: Code-split the share sheet component
6. **Real-time**: Debounce updates by 100ms

```typescript
// Good: Efficient pagination
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', id)
  .order('created_at', { ascending: false })
  .limit(20);

// Good: Metadata validation
function validateMetadata(metadata: any): boolean {
  const size = new Blob([JSON.stringify(metadata)]).size;
  return size < 10 * 1024; // 10KB limit
}
```

---

## 📝 Testing Checklist

### Must Test
- [ ] Share post (single recipient)
- [ ] Share post (multiple recipients)
- [ ] Share profile
- [ ] Click shared post → opens full post
- [ ] Click shared profile → opens profile
- [ ] Real-time message delivery
- [ ] Deleted post handling
- [ ] Search in share sheet
- [ ] Pagination of messages
- [ ] Unsupported message types

### Edge Cases
- [ ] Empty conversation list
- [ ] No search results
- [ ] Corrupted metadata
- [ ] Network errors
- [ ] Very long content (truncation)
- [ ] Poll posts
- [ ] Posts with no media

---

## 🚦 Quick Start Checklist

### Backend (5 mins)
1. ✅ Run database migration (add `message_type` and `metadata` columns)
2. ✅ Verify RLS policies are enabled
3. ✅ Create indexes for performance

### Frontend (2-3 hours)
1. ✅ Create TypeScript types
2. ✅ Build message bubble factory
3. ✅ Create PostShareBubble component
4. ✅ Create ProfileShareBubble component
5. ✅ Build InstagramShareSheet
6. ✅ Add share buttons to posts/profiles
7. ✅ Implement real-time subscriptions
8. ✅ Add error handling

### Testing (1 hour)
1. ✅ Test share flow end-to-end
2. ✅ Test real-time delivery
3. ✅ Test error scenarios
4. ✅ Performance testing

---

## 📚 Resources

- **Full Documentation**: `RICH_MESSAGES_NEXTJS_DOCUMENTATION.md`
- **Flutter Source Code**: `lib/features/presentation/pages/chat/`
- **Database Schema**: `supabase/migrations/20251004_create_core_schema.sql`
- **Share Sheet**: `lib/features/presentation/widgets/instagram_share_sheet.dart`
- **Metadata Models**: `lib/features/data/models/message_metadata/`

---

## 💡 Key Takeaways

1. **All preview data is in metadata** - No extra fetches needed for display
2. **Versioning is built-in** - `version: 1` in all metadata for future compatibility
3. **Graceful degradation** - Unknown message types show "Unsupported" bubble
4. **Security first** - RLS policies prevent unauthorized access
5. **Performance optimized** - Thumbnails, pagination, caching all considered

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Metadata too large | Use thumbnails, limit text length |
| Post not loading | Check if deleted, handle gracefully |
| Real-time not working | Verify channel subscription and filters |
| Share sheet empty | Check conversation status is 'approved' |
| Slow message load | Add indexes, implement pagination |

---

**Questions?** Refer to the full documentation or contact the Flutter team.

**Version:** 1.0.0 | **Last Updated:** 2025-10-05
