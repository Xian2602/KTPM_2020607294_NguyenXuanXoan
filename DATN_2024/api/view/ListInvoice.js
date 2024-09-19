const ListInvoice = (invoices) => {
    return `
    <h1>Unpaid Invoices</h1>
    
    <p class="success"><strong>Success!</strong> The invoice has been sent to the client.</p>
    
    <p class="error"><strong>Whoops!</strong> Something went wrong and your invoice could not be sent.</p>
    
    <h3>{{this.customer}}</h3>
    <p>ID: {{this.id}} <br />
        <a href="/api/invoices/{{this.id}}">View</a> | <a href="/api/invoices/export/{{this.id}}">Email Reminder</a>
    </p>
    
    `
}