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
        return Result.success(groups);
    }

    public Result<?> getMessageList(Long groupId, Long userId) {
        List<ChatMessage> messages = chatMessageMapper.selectList(
                new LambdaQueryWrapper<ChatMessage>()
                        .eq(ChatMessage::getGroupId, groupId)
                        .eq(ChatMessage::getUserId, userId)
                        .orderByAsc(ChatMessage::getCreateTime)
        );
        return Result.success(messages);
    }

    public Result<?> delMsgGroupList(Long groupId, Long userId) {
        chatGroupMapper.delete(
                new LambdaQueryWrapper<ChatGroup>()
                        .eq(ChatGroup::getId, groupId)
                        .eq(ChatGroup::getUserId, userId)
        );
        chatMessageMapper.delete(
                new LambdaQueryWrapper<ChatMessage>()
                        .eq(ChatMessage::getGroupId, groupId)
        );
        return Result.success();
    }

    public ChatGroup createGroup(Long userId, String title, String type) {
        ChatGroup group = new ChatGroup();
        group.setUserId(userId);
        group.setTitle(title);
        group.setType(type);
        chatGroupMapper.insert(group);
        return group;
    }

    public void saveMessage(Long groupId, Long userId, String role, String content) {
        ChatMessage message = new ChatMessage();
        message.setGroupId(groupId);
        message.setUserId(userId);
        message.setRole(role);
        message.setContent(content);
        chatMessageMapper.insert(message);
    }
}
