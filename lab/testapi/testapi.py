import ollama


with open("resume.txt", "r", encoding="utf-8") as f:
    resume_text = f.read()

with open("job.txt", "r", encoding="utf-8") as f:
    job_description = f.read()


prompt = f"""
You are my personal resume optimizer. 
1. Compare my resume to the job description.
2. Highlight missing keywords, skills, and phrases.
3. Rewrite my resume so it matches the job description without inventing experiences.
4. Keep formatting professional and ATS-friendly.
5. Suggest 2–3 bullet points that I could add.

Job Description:
{job_description}

Resume:
{resume_text}
"""


response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
optimized_resume = response["message"]["content"]


with open("optimized_resume.txt", "w") as f:
    f.write(optimized_resume)

print("Optimized resume saved to optimized_resume.txt")