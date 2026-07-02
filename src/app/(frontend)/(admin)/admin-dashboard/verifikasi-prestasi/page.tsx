import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import VerificationActions from '@/app/(frontend)/(admin)/admin-dashboard/VerificationActions'
import { CheckCircleIcon, Clock, LucideCircleX, Trophy, User2 } from 'lucide-react'
import { StatusBadge, TingkatBadge } from '../../components/Badges'
import StatCard from './StatCard'
import PaginationControls from '@/app/(frontend)/components/PaginationControls'
import SearchBar from '@/app/(frontend)/components/SearchBar'
import TableFilter, { FilterConfig } from '@/app/(frontend)/components/TableFilter'
import { buildSortParam } from '@/lib/buildSortParam'
import SortableTableHeader from '@/app/(frontend)/components/SortableTableHeader'
export const dynamic = 'force-dynamic'
export const revalidate = 0
type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
export default async function VerifikasiPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config })

  const resolvedParams = await searchParams
  const currentStatus = resolvedParams.status || 'pending'

  const currentPage = Number(resolvedParams.page) || 1
  const limitPerPage = 10
  const searchTerm = resolvedParams.search || ''
  const filterPeringkat = resolvedParams.peringkat ? resolvedParams.peringkat.split(',') : []
  const filterJenis = resolvedParams.jenisKejuaraan ? resolvedParams.jenisKejuaraan.split(',') : []
  const filterTingkat = resolvedParams.tingkat ? resolvedParams.tingkat.split(',') : []

  const sortField = resolvedParams.sort
  const sortDir = resolvedParams.dir

  const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
    payload.count({ collection: 'achievements', where: { status: { equals: 'pending' } } }),
    payload.count({ collection: 'achievements', where: { status: { equals: 'approved' } } }),
    payload.count({ collection: 'achievements', where: { status: { equals: 'rejected' } } }),
  ])

  const tableTitle =
    {
      pending: 'Menunggu Verifikasi',
      approved: 'Prestasi Disetujui',
      rejected: 'Prestasi Ditolak',
    }[currentStatus] || 'Daftar Prestasi'

  const queryWhere: any = {
    and: [{ status: { equals: currentStatus } }],
  }
  if (searchTerm) {
    queryWhere.and.push({
      or: [
        // { namaKejuaraan: { contains: searchTerm } },
        { 'atlet.namaLengkap': { contains: searchTerm } },
      ],
    })
  }
  if (filterPeringkat.length > 0) {
    queryWhere.and.push({ peringkat: { in: filterPeringkat } })
  }

  if (filterTingkat.length > 0) {
    queryWhere.and.push({ tingkatKejuaraan: { in: filterTingkat } })
  }

  if (filterJenis.length > 0) {
    queryWhere.and.push({ jenisKejuaraan: { in: filterJenis } })
  }
  const tableData = await payload.find({
    collection: 'achievements',
    where: queryWhere,
    depth: 2,
    sort: buildSortParam(sortField, sortDir, '-createdAt'),
    limit: limitPerPage,
    page: currentPage,
  })

  // console.log(tableData)

  const prestasiFilters: FilterConfig[] = [
    {
      key: 'peringkat',
      placeholder: 'Filter Peringkat',
      options: [
        { label: 'Juara 1', value: 'Juara 1' },
        { label: 'Juara 2', value: 'Juara 2' },
        { label: 'Juara 3', value: 'Juara 3' },
      ],
    },
    {
      key: 'jenisKejuaraan',
      placeholder: 'Filter Jenis',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Festival', value: 'Festival' },
      ],
    },
    {
      key: 'tingkat',
      placeholder: 'Filter Tingkat',
      options: [
        { label: 'Kabupaten/Kota', value: 'Kabupaten/Kota' },
        { label: 'Provinsi', value: 'Provinsi' },
        { label: 'Nasional', value: 'Nasional' },
        { label: 'Internasional', value: 'Internasional' },
      ],
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="font-medium text-[32px]">Verifikasi Prestasi</h1>
        <div className="grid grid-cols-3 gap-6">
          {/* Cards */}
          <StatCard
            count={pendingCount.totalDocs}
            label="Menunggu Verifikasi"
            icon={Clock}
            theme="yellow"
            href="?status=pending&page=1"
            isActive={currentStatus === 'pending'}
          />
          <StatCard
            count={approvedCount.totalDocs}
            label="Prestasi Disetujui"
            icon={CheckCircleIcon}
            theme="green"
            href="?status=approved&page=1"
            isActive={currentStatus === 'approved'}
          />
          <StatCard
            count={rejectedCount.totalDocs}
            label="Prestasi Ditolak"
            icon={LucideCircleX}
            theme="red"
            href="?status=rejected&page=1"
            isActive={currentStatus === 'rejected'}
          />{' '}
        </div>
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Verifikasi Prestasi</h1>
        <p className="text-slate-500">Daftar pengajuan prestasi yang membutuhkan peninjauan.</p>
      </div> */}
        <TableFilter filters={prestasiFilters} />
        <SearchBar placeholder="Cari nama atlet..." />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-5">
        {/* Header Section dengan Icon */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100">
          {currentStatus === 'pending' && <Clock className="w-5 h-5 text-orange-400" />}
          {currentStatus === 'approved' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
          {currentStatus === 'rejected' && <LucideCircleX className="w-5 h-5 text-red-500" />}
          <h2 className="font-semibold text-slate-800 text-[15px]">{tableTitle}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-800 text-sm">No.</th>
                <SortableTableHeader label="Nama Atlet" sortKey="atlet.namaLengkap" />
                <SortableTableHeader label="Nama Kejuaraan" sortKey="namaKejuaraan" />
                <SortableTableHeader label="Juara" sortKey="peringkat" />
                <SortableTableHeader label="Jenis Kejuaraan" sortKey="jenisKejuaraan" />
                <SortableTableHeader label="Tingkat" sortKey="tingkatKejuaraan" />
                {/* <th className="py-4 px-6 font-bold text-slate-800 text-sm">Nama Kejuaraan</th>
                <th className="py-4 px-6 font-bold text-slate-800 text-sm">Juara</th>
                <th className="py-4 px-6 font-bold text-slate-800 text-sm">Jenis Kejuaraan</th>
                <th className="py-4 px-6 font-bold text-slate-800 text-sm text-center">Tingkat</th> */}
                <th className="py-4 px-6 font-bold text-slate-800 text-sm text-center">Status</th>
                <th className="py-4 px-6 font-bold text-slate-800 text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* 6. Gunakan tableData.docs, bukan lagi pendingAchievements */}
              {tableData.docs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Tidak ada data untuk kategori ini.
                  </td>
                </tr>
              ) : (
                tableData.docs.map((doc: any, index) => (
                  <tr
                    key={doc.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* ... [Kolom isi Anda tetap utuh, gunakan doc variabel] ... */}
                    <td className="py-4 px-6">
                      <div className=" text-slate-800">
                        {(currentPage - 1) * limitPerPage + index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{doc.atlet?.namaLengkap}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 text-sm whitespace-normal max-w-[250px]">
                        {doc.namaKejuaraan}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-800">{doc.peringkat}</td>
                    <td className="py-4 px-6 text-sm text-slate-800 text-center">
                      {doc.jenisKejuaraan}
                    </td>
                    <td className="py-4 px-6 text-center ">
                      <TingkatBadge tingkat={doc.tingkatKejuaraan} />
                    </td>
                    <td className="py-4 px-6 text-center  ">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <VerificationActions doc={doc} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls
          currentPage={tableData.page || 1}
          totalPages={tableData.totalPages}
          hasNextPage={tableData.hasNextPage}
          hasPrevPage={tableData.hasPrevPage}
          currentStatus={currentStatus}
          nextPage={tableData.nextPage} // [!] Gunakan native mapper Payload
          prevPage={tableData.prevPage} // [!] Gunakan native mapper Payload
        />
      </div>
    </>
  )
}
