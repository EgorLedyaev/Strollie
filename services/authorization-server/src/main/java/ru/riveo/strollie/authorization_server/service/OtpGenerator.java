package ru.riveo.strollie.authorization_server.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OtpGenerator {

    private static final SecureRandom random = new SecureRandom();

    public String generate() {
        List<Integer> uniqueDigits = random.ints(0, 10)
                .distinct()
                .limit(4)
                .boxed()
                .collect(Collectors.toList());

        List<Integer> firstPair = uniqueDigits.subList(0, 2);
        List<Integer> secondPair = uniqueDigits.subList(2, 4);

        String firstTriple = generateTriple(firstPair);

        String secondTriple = generateTriple(secondPair);
        return firstTriple + secondTriple;
    }

    private String generateTriple(List<Integer> pair) {
        int thirdDigit = pair.get(random.nextInt(pair.size()));

        List<Integer> triple = Arrays.asList(pair.get(0), pair.get(1), thirdDigit);

        Collections.shuffle(triple, random);

        return triple.stream()
                .map(String::valueOf)
                .collect(Collectors.joining());
    }
}