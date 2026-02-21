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
    public static String[] split(String text){

        ArrayList<String> returner = new ArrayList<String>();

        
    }
}
