import os, json, re

EMOJI_OVERRIDES_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "emoji_overrides.json")

def _read():
    if not os.path.exists(EMOJI_OVERRIDES_PATH):
        return {}
    with open(EMOJI_OVERRIDES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def _write(data: dict):
    os.makedirs(os.path.dirname(EMOJI_OVERRIDES_PATH), exist_ok=True)
    with open(EMOJI_OVERRIDES_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def save_override(var_name: str, name: str, emoji_id: str, animated: bool = False):
    data = _read()
    data[var_name] = {"name": name, "emoji_id": emoji_id, "animated": animated}
    _write(data)

def delete_override(var_name: str):
    data = _read()
    data.pop(var_name, None)
    _write(data)

def get_all_overrides():
    return _read()

def apply_overrides_to_file(emoji_py_path: str) -> bool:
    overrides = _read()
    if not overrides:
        return False
    with open(emoji_py_path, "r", encoding="utf-8") as f:
        content = f.read()
    changed = False
    for var_name, info in overrides.items():
        name = info["name"]
        eid = info["emoji_id"]
        animated = info.get("animated", False)
        a = "a" if animated else ""
        new_line = f'{var_name} = "<{a}:{name}:{eid}>"'
        match = re.search(rf'^{re.escape(var_name)}\s*=\s*".*?"', content, re.MULTILINE)
        if match:
            content = content[:match.start()] + new_line + content[match.end():]
            changed = True
    if changed:
        with open(emoji_py_path, "w", encoding="utf-8") as f:
            f.write(content)
    return changed

def save_all(entries: list):
    """entries: list of dicts with var_name, name, emoji_id, animated"""
    data = {}
    for e in entries:
        data[e["var_name"]] = {"name": e["name"], "emoji_id": e["emoji_id"], "animated": e.get("animated", False)}
    _write(data)
