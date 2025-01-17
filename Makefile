.PHONY: serve

PORT ?= 8000

serve:
	@echo "Serving on http://localhost:$(PORT)"
	python3 -m http.server $(PORT) --directory docs

