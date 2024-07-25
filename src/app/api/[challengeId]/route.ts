import { NextRequest } from 'next/server'


export async function GET(req: NextRequest, { params }: { params: {challengeId: string} }) {
	console.log(params)
	return new Response(params.challengeId)
}