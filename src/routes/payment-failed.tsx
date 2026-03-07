import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payment-failed')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='h-[calc(100vh-64px)] w-full flex flex-row items-center justify-center'>
        Sorry!!! Your payment failed. Please try again.
    </div>
}
