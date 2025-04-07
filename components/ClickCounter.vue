<template>
<div class="click-counter">
    <h2>Click Counter</h2>

    <p>Counter value: <strong>{{ count }}</strong></p>

    <button @click="incrementCounter" class="increment-btn">
        Increment Counter
    </button>

    <p v-if="lastClicked">Last clicked: {{ formatDate(lastClicked) }}</p>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
</div>
</template>

<script>
export default {
    props: {
        buttonId: {
            type: String,
            default: 'main-counter'
        }
    },
    data() {
        return {
            count: 0,
            lastClicked: null,
            loading: false,
            error: null
        }
    },
    mounted() {
        this.fetchCount()
    },
    methods: {
        formatDate(dateString) {
            return new Date(dateString).toLocaleString()
        },
        async fetchCount() {
            this.loading = true
            this.error = null

            try {
                const response = await fetch(`/api/clicks/${this.buttonId}`)
                const data = await response.json()

                console.log("Fetched data:", data)

                if (data.error) {
                    throw new Error(data.error)
                }

                this.count = data.count || 0
                this.lastClicked = data.last_clicked || null
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async incrementCounter() {
            this.loading = true
            this.error = null

            try {
                console.log("Incrementing counter for button ID:", this.buttonId)

                const response = await fetch('/api/clicks/increment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: this.buttonId })
                })

                const data = await response.json()
                console.log("Increment response:", data)

                if (data.error) {
                    throw new Error(data.error)
                }

                this.count = data.count || 0
                this.lastClicked = data.last_clicked || null
            } catch (err) {
                this.error = "Error incrementing counter: " + err.message
                console.error("Increment error:", err)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.click-counter {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
}

.increment-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 15px 0;
    transition: background-color 0.3s;
}

.increment-btn:hover {
    background-color: #45a049;
}

.loading {
    margin-top: 10px;
    color: #666;
}

.error {
    margin-top: 10px;
    color: #f44336;
}
</style>