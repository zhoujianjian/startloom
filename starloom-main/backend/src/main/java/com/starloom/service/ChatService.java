package com.starloom.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.starloom.common.Result;
import com.starloom.entity.ChatGroup;
import com.starloom.entity.ChatMessage;
import com.starloom.mapper.ChatGroupMapper;
import com.starloom.mapper.ChatMessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatGroupMapper chatGroupMapper;
    private final ChatMessageMapper chatMessageMapper;

    public Result<?> getMsgGroupList(Long userId) {
        List<ChatGroup> groups = chatGroupMapper.selectList(
                new LambdaQueryWrapper<ChatGroup>()
                        .eq(ChatGroup::getUserId, userId)
                        .orderByDesc(ChatGroup::getUpdateTime)
        );
        // 前端期望的格式: { messageList: [...] }
        Map<String, Object> result = new HashMap<>();
        result.put("messageList", groups);
        return Result.success(result);
    }

    public Result<?> getMessageList(Long groupId, Long userId) {
        List<ChatMessage> messages = chatMessageMapper.selectList(
                new LambdaQueryWrapper<ChatMessage>()
                        .eq(ChatMessage::getGroupId, groupId)
                        .eq(ChatMessage::getUserId, userId)
                        .orderByAsc(ChatMessage::getCreateTime)
        );
        // 前端期望的格式: { messageList: [...] }
        Map<String, Object> result = new HashMap<>();
        result.put("messageList", messages);
        return Result.success(result);
    }

    public Result<?> delMsgGroupList(List<String> msggroups, Long userId) {
        for (String msggroup : msggroups) {
            Long groupId = Long.valueOf(msggroup);
            chatGroupMapper.delete(
                    new LambdaQueryWrapper<ChatGroup>()
                            .eq(ChatGroup::getId, groupId)
                            .eq(ChatGroup::getUserId, userId)
            );
            chatMessageMapper.delete(
                    new LambdaQueryWrapper<ChatMessage>()
                            .eq(ChatMessage::getGroupId, groupId)
            );
        }
        return Result.success();
    }

    public ChatGroup getOrCreateGroup(Long userId, String msggroup, String title, String type) {
        // 尝试查找已存在的 group
        if (msggroup != null && !msggroup.isEmpty()) {
            try {
                Long groupId = Long.valueOf(msggroup);
                ChatGroup existing = chatGroupMapper.selectOne(
                        new LambdaQueryWrapper<ChatGroup>()
                                .eq(ChatGroup::getId, groupId)
                                .eq(ChatGroup::getUserId, userId)
                );
                if (existing != null) {
                    return existing;
                }
            } catch (NumberFormatException ignored) {
                // msggroup 可能是前端生成的时间戳，不是数据库ID
            }
        }
        // 创建新的 group
        return createGroup(userId, title, type);
    }

    public ChatGroup createGroup(Long userId, String title, String type) {
        ChatGroup group = new ChatGroup();
        group.setUserId(userId);
        group.setTitle(title);
        group.setType(type != null ? type : "0");
        chatGroupMapper.insert(group);
        return group;
    }

    public void saveMessage(Long groupId, Long userId, String role, String content, 
                           String type, String subModule, Integer base64Type) {
        ChatMessage message = new ChatMessage();
        message.setGroupId(groupId);
        message.setUserId(userId);
        message.setRole(role);
        message.setContent(content);
        message.setType(type != null ? type : (role.equals("user") ? "user" : "gpt"));
        message.setSubModule(subModule);
        message.setBase64Type(base64Type != null ? base64Type : 0);
        chatMessageMapper.insert(message);
    }
    
    // 兼容旧方法
    public void saveMessage(Long groupId, Long userId, String role, String content) {
        saveMessage(groupId, userId, role, content, null, null, null);
    }

    public void updateGroupTitle(Long groupId, String title) {
        ChatGroup group = chatGroupMapper.selectById(groupId);
        if (group != null) {
            group.setTitle(title);
            chatGroupMapper.updateById(group);
        }
    }
}
