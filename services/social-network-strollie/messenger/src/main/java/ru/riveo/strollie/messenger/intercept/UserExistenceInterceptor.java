package ru.riveo.strollie.messenger.intercept;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import ru.riveo.strollie.messenger.entity.UserEntity;
import ru.riveo.strollie.messenger.repository.UserRepository;
import ru.riveo.strollie.messenger.util.PrincipalUtil;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserExistenceInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            UUID userId = PrincipalUtil.getUserId(authentication);
            String username = PrincipalUtil.getUsername(authentication);

            boolean exists = userRepository.existsById(userId);
            if (!exists) {
                UserEntity user = new UserEntity();
                user.setId(userId);
                user.setUsername(username);
                userRepository.save(user);
            }
        }

        return true;
    }
}
