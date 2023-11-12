'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams,useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {

  //получаем имеющиеся query в URL
  const searchParams = useSearchParams();
  const router = useRouter()
  const path = usePathname()

  const handleSearch = useDebouncedCallback((term:string) => {
    //создаем новый объект URLSearchParams в который передаем имеющийся query из хука + добавляем необходимые значения
    const updatedParams = new URLSearchParams(searchParams)
    if (term) { 
      updatedParams.set('query', term)
    } else {
      updatedParams.delete('query')
    }
    //обновить url учитывая query
    router.replace(path+"?"+updatedParams.toString())
  }, 300)

  return (
    <div className="relative flex flex-1 flex-shrink-0" >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        defaultValue={searchParams.get("query")?.toString() || ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
