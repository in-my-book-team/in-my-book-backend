export const getMailContent = (link: string): string => `
<div>
    <h1>To activate follow the link</h1>
    <a href="${link}">${link}</a>
</div>`;
