# Synthetic fixture — a customer-support chatbot. Not real code.
# Used to exercise eu-ai-act-scan.cjs (frameworks, model id, transparency).
from openai import OpenAI

client = OpenAI()
MODEL = "gpt-4o"


def reply(history):
    # NOTE: this fixture deliberately ships NO user-facing disclosure of the
    # automated nature of the assistant — the kind of Art. 50(1) gap the scanner
    # should surface (it will report 0 transparency controls present).
    return client.chat.completions.create(model=MODEL, messages=history)
