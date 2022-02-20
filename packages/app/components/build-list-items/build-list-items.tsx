import { CICCDBuild } from '../../interfaces/build';
import { BuildListItem } from '../build-list-item';

export function BuildListItems({
  builds,
}: {
  builds: readonly (CICCDBuild & { id: string })[];
}) {

  return (
    <div
      className='border rounded-lg'
    >
      {
        builds.map((data) => {
          return (
            <BuildListItem
              {...data}
              key={data.id}
            />
          );
        })
      }
    </div>
  );
}
