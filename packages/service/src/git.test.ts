import {getCommitInfo} from './git';

describe('git: getCommitInfo', () => {
  it('to return the authors email', async () => {
    const info = await getCommitInfo(
      '269a947ca561992265d824080ae53cdf3fd8ad96'
    );

    expect(info.author.email).toBe('wouter.commandeur@smartphoto.com');
  });
});
