import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5174
        await page.goto("http://localhost:5174", wait_until="commit", timeout=10000)
        
        # -> Navigate to /recebimento (use explicit navigate to http://localhost:5174/recebimento since the page has no clickable navigation elements).
        await page.goto("http://localhost:5174/recebimento", wait_until="commit", timeout=10000)
        
        # -> Fill required Nota Fiscal fields (NF number, Peso, Metragem, Quantidade) then open the Fornecedor dropdown to select the supplier (click to expand the options).
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10001')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1500')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2100')
        
        # -> Open the Fornecedor (supplier) dropdown to select the first available supplier (click element index 505).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> List dropdown options for Fornecedor (index 762) and select the first non-placeholder option (e.g., 'Klabin S.A. ( KLAB )'), then click 'Continuar' (index 940) to proceed to the reel registration step.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Open supplier dropdown options, select the exact option 'Klabin S.A. ( KLAB )' using select_dropdown, then click 'Continuar' to proceed to reel registration.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Fill Número da NF, Peso Bruto Total, Metragem Total, Quantidade de Volumes (2) and click 'Continuar' (index 1178) to proceed to reel registration.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('NF-10001')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1500')
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2100')
        
        # -> Input '2' into Quantidade de Volumes (Bobinas) (index 1242) then click 'Continuar' (index 1416) to proceed to the reel registration step.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[5]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('2')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Click the 'Continuar' button (index 1663) to attempt to advance to the reel registration step (again) so the 'Add Reel' controls appear.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/div/form/div[6]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Lote salvo com sucesso').first).to_be_visible(timeout=3000)
        await expect(frame.locator('text=UVPACK').first).to_be_visible(timeout=3000)
        assert '/estoque' in frame.url
        await expect(frame.locator('text=NF-10001').first).to_be_visible(timeout=3000)
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    