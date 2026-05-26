package ru.riveo.strollie.client.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import ru.riveo.strollie.client.client.RestClientMessenger;
import ru.riveo.strollie.client.dto.ChatDto;
import ru.riveo.strollie.client.dto.CreateChatRequest;
import ru.riveo.strollie.client.dto.MessageDto;
import ru.riveo.strollie.client.dto.SendMessageRequest;

import java.security.Principal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatsController {

    private final RestClientMessenger restClientMessenger;

    @GetMapping("/chats")
    public String chats(Model model, Principal principal) {
        String username = restClientMessenger.getUsernameById(UUID.fromString(principal.getName()));
        model.addAttribute("username", username);

        List<ChatDto> chats = restClientMessenger.getUserChats();
        model.addAttribute("chats", chats);
        return "chats";
    }

    @GetMapping("/chats/create")
    public String createChatForm(Model model) {
        model.addAttribute("chatForm", new CreateChatRequest());
        return "create_chat";
    }

    @PostMapping("/chats/create")
    public String submitCreateChat(@ModelAttribute("chatForm") CreateChatRequest chatForm,
                                   @RequestParam("participantUsernames") String participantUsernamesRaw) {
        List<String> usernames = Arrays.stream(participantUsernamesRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        chatForm.setParticipantUsernames(usernames);

        restClientMessenger.createChat(chatForm);
        return "redirect:/chats";
    }

    @GetMapping("/chats/{id}")
    public String viewChat(@PathVariable UUID id, Model model) {
        ChatDto chat = restClientMessenger.getChatById(id);
        List<MessageDto> messages = restClientMessenger.getMessagesByChatId(id);
        Collections.reverse(messages);

        model.addAttribute("chat", chat);
        model.addAttribute("author", restClientMessenger.getUsernameById(chat.getAuthorId()));
        model.addAttribute("messages", messages);

        return "chat";
    }

    @PostMapping("/chats/{id}/send")
    public String sendMessage(@PathVariable UUID id, @RequestParam String content) {
        SendMessageRequest request = new SendMessageRequest();
        request.setChatId(id);
        request.setContent(content);

        restClientMessenger.sendMessage(request);
        return "redirect:/chats/" + id;
    }

    @PostMapping("/chats/{id}/add-participant")
    public String addParticipant(@PathVariable UUID id,
                                 @RequestParam String username,
                                 RedirectAttributes redirectAttributes) {
        try {
            restClientMessenger.addParticipant(id, username);
            return "redirect:/chats/" + id;
        } catch (Exception e) {
            return "redirect:/errorAdd";
        }
    }

    @PostMapping("/chats/{id}/remove-participant")
    public String removeParticipant(@PathVariable UUID id,
                                    @RequestParam String username,
                                    RedirectAttributes redirectAttributes) {
        try {
            restClientMessenger.removeParticipant(id, username);
            return "redirect:/chats/" + id;
        } catch (Exception e) {
            return "redirect:/errorRemove";
        }
    }

    @GetMapping("/errorRemove")
    public String errorRemovePage(@RequestParam(value = "error", required = false) String error, Model model) {
        return "errorRemove";
    }

    @GetMapping("/errorAdd")
    public String errorAddPage(@RequestParam(value = "error", required = false) String error, Model model) {
        return "errorAdd";
    }

}
