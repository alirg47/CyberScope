# import requests

# SPACE_URL = "https://mr-hassan-cyberscope.hf.space/generate"  # <-- Replace with your real Space URL

# payload = {
#     "prompt": "Explain brute force attacks in one sentence.",
#     "max_tokens": 200
# }

# response = requests.post(SPACE_URL, json=payload)

# print("Status Code:", response.status_code)
# print("Raw Response:", response.text)

# try:
#     data = response.json()
#     print("\nLLM Output:", data.get("output", data))
# except:
#     print("\nError: Could not parse JSON.")


import requests

resp = requests.post(
    "https://mr-hassan-cyberscope.hf.space/generate",
    json={"prompt": "Hello", "max_tokens": 150}
)
print(resp.json())
