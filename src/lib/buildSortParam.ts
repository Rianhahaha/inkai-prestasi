/**
 * Converts URL sort params ke Payload CMS sort string.
 * Payload format: '-fieldName' untuk desc, 'fieldName' untuk asc.
 *
 * @param sort  - nilai dari searchParams.sort
 * @param dir   - nilai dari searchParams.dir ('asc' | 'desc')
 * @param defaultSort - fallback jika tidak ada sort aktif
 */
export function buildSortParam(
  sort: string | undefined,
  dir: string | undefined,
  defaultSort = '-createdAt',
): string {
  if (!sort) return defaultSort
  return dir === 'desc' ? `-${sort}` : sort
}
