export const clearSearchFilter = (sessionStorageService) => {
    const input = (document.getElementById('searchright') as HTMLInputElement);
    sessionStorageService.clearSearchFilter();
    input.value = '';

}