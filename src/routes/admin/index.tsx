import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Tabs id='Data Managing Dashboard' defaultValue='orders'>
        <div className="flex flex-row items-center gap-2">
          <TabsList>
            <TabsTrigger value='orders'>Orders</TabsTrigger>
            <TabsTrigger value='products'>Products</TabsTrigger>
            <TabsTrigger value='users'>Users</TabsTrigger>
          </TabsList>
          <button className={cn(tabsListVariants(), "px-2 text-sm")}>Add Products +</button>

        </div>
        <TabsContent value='orders'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Order Id</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Customer</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Product</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Quantity</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Price</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Customizations</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Payment</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              <tr className='hover:bg-gray-50'>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">123</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rahul</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apple</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">[quality: "good"]</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Received (Online)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pending</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">||</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value='products'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Product Id</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Product Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Product Images</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Price</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Quantity</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Customizations</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Label</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              <tr className='hover:bg-gray-50'>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">123</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apple</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">src=""</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. 50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30 kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">[quality: "good"]</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Best Seller</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Live</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">||</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value='users'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>User Id</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Email</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Phone</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Address</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Total Order</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Total Spent</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase text-gray-600 tracking-wide'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              <tr className='hover:bg-gray-50'>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">123</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rahul</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">rahul@gmail.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">980000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Apt. 3, City</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. 9000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Eligible</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">||</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
      </Tabs>







    </>
  )
}
