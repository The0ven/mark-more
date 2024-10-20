build: backend
	pnpm build
	pnpm start

dev: backend
	pnpm dev

backend:
	cd backend
	go run .
