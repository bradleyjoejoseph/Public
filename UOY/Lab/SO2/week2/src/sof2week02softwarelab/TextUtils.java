package sof2week02softwarelab;
import java.util.ArrayList;
public class TextUtils {

    public static int toBase10(String binary){
        int result = 0;
        int lenny = binary.length()-1;
        for (int i = lenny; i >= 0; i--) {
            if (binary.charAt(i) == '1') {
                result += Math.pow(2, lenny-i);
            }
        }


        return result;
    }
    // excersize 2
    /*For this question we are emulating the method split() from the type str In Python. In the
class TextUtils implement the static method String[] split(String text) where
text is a string. The method returns an array of String which contains the words from the text
(split by a blank space).
You must NOT use the any existing classes such as StringTokenizer to solve the
problem. */
    public static String[] split(String text) {
        ArrayList<String> words = new ArrayList<>();
        String currentWord = "";
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == ' ') {
                if (!currentWord.isEmpty()) {
                    words.add(currentWord);
                }
                currentWord = "";
            } else {
                currentWord += c;
            }
        }
        
        if (!currentWord.isEmpty()) {
            words.add(currentWord);
        }
        
        return words.toArray(new String[0]);
    }

//     Exercise 3: a more flexible split.
// In TextUtils, overload the method split(String text, String separators)
// where text is a string to be split, separators is a string containing all the characters used
// to split the text (for example “,.!? “). The method returns an array of String containing the
// list of tokens separated by one of the separators
    public static String[] split(String text, String separators) {
        if (text == null) {
            return null;
        }
        if (separators == null) {
            separators = " ";
        }

        ArrayList<String> tokens = new ArrayList<>();
        StringBuilder current = new StringBuilder();

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            boolean isSep = false;
            for (int j = 0; j < separators.length(); j++) {
                if (c == separators.charAt(j)) {
                    isSep = true;
                    break;
                }
            }

            if (isSep) {
                if (current.length() > 0) {
                    tokens.add(current.toString());
                    current.setLength(0);
                }
            } else {
                current.append(c);
            }
        }

        if (current.length() > 0) {
            tokens.add(current.toString());
        }

        return tokens.toArray(new String[0]);
    }

}


