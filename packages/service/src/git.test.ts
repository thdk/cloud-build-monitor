import {getCommitInfo} from './git';

describe('git: getCommitInfo', () => {
  it('to return the authors email', async () => {
    const info = await getCommitInfo(
      '5c05fd1d646feaead10d07ca5d1a67668b0d7897'
    );

    expect(info.author.email).toBe('t.dekiere@gmail.com');
  });
});
