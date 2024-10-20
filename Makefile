.PHONY: start
start: build
	pnpm start

.PHONY: build
build: backend
	pnpm build

.PHONY: dev
dev: backend
	pnpm dev

.PHONY: backend
backend:
	cd backend && \
	go run . &
