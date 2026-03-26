<script lang="ts" setup>
import { ref, computed } from 'vue'
import { gsap } from 'gsap'

interface FormField {
  value: string
  error: string
  touched: boolean
}

interface ContactForm {
  name: FormField
  email: FormField
  message: FormField
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── Refs ────────────────────────────────────────────────────────────────────

const formRef = ref<HTMLFormElement | null>(null)
const status = ref<FormStatus>('idle')
const serverError = ref('')

const form = ref<ContactForm>({
  name:    { value: '', error: '', touched: false },
  email:   { value: '', error: '', touched: false },
  message: { value: '', error: '', touched: false },
})

// ─── Validation ───────────────────────────────────────────────────────────────

function validateField(field: keyof ContactForm): string {
  const val = form.value[field].value.trim()
  if (!val) return 'This field is required.'
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    return 'Please enter a valid email.'
  if (field === 'message' && val.length < 10)
    return 'Message must be at least 10 characters.'
  return ''
}

function onBlur(field: keyof ContactForm) {
  form.value[field].touched = true
  form.value[field].error = validateField(field)
}

const isFormValid = computed(() =>
  (['name', 'email', 'message'] as const).every(
    f => form.value[f].value.trim() && !validateField(f)
  )
)

// ─── Animation ────────────────────────────────────────────────────────────────

function animateSubmitError() {
  if (!formRef.value) return
  gsap.fromTo(formRef.value, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
}

function animateSuccess() {
  const fields = formRef.value?.querySelectorAll('.contact__field')
  if (!fields) return
  gsap.to(fields, { autoAlpha: 0, y: -8, stagger: 0.06, duration: 0.3, ease: 'power2.in' })
}

// ─── Submit ───────────────────────────────────────────────────────────────────

async function onSubmit() {
  ;(['name', 'email', 'message'] as const).forEach(f => {
    form.value[f].touched = true
    form.value[f].error = validateField(f)
  })

  if (!isFormValid.value) { animateSubmitError(); return }

  status.value = 'loading'
  serverError.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name:    form.value.name.value,
        email:   form.value.email.value,
        message: form.value.message.value,
      },
    })

    animateSuccess()
    await new Promise(r => setTimeout(r, 350))
    status.value = 'success'
  } catch (err: any) {
    serverError.value = err?.data?.message || 'Something went wrong. Please try again.'
    status.value = 'error'
    animateSubmitError()
  }
}

function resetForm() {
  form.value = {
    name:    { value: '', error: '', touched: false },
    email:   { value: '', error: '', touched: false },
    message: { value: '', error: '', touched: false },
  }
  status.value = 'idle'
  serverError.value = ''
}
</script>

<template>
  <section class="contact page__component">

    <!-- ── Success ─────────────────────────────────────────── -->
    <Transition name="msg">
      <div v-if="status === 'success'" class="contact__success">
        <p class="contact__success-title">
          <span class="dot">> </span>Message sent<span class="dot">_</span>
        </p>
        <p class="contact__success-sub">I'll get back to you as soon as possible.</p>

        <div class="contact__btn-wrap">
          <button class="contact__btn" type="button" @click="resetForm">
            Send another
          </button>
        </div>
      </div>
    </Transition>

    <!-- ── Form ───────────────────────────────────────────── -->
    <form
      v-if="status !== 'success'"
      ref="formRef"
      class="contact__form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <!-- Name -->
      <div :class="['contact__field', { 'contact__field--error': form.name.touched && form.name.error }]">
        <label class="contact__label" for="contact-name">Name</label>
        <div class="contact__input-wrap">
          <input
            id="contact-name"
            v-model="form.name.value"
            class="contact__input"
            type="text"
            placeholder="Your name"
            autocomplete="name"
            @blur="onBlur('name')"
          />
        </div>
        <Transition name="msg">
          <span v-if="form.name.touched && form.name.error" class="contact__error">
            {{ form.name.error }}
          </span>
        </Transition>
      </div>

      <!-- Email -->
      <div :class="['contact__field', { 'contact__field--error': form.email.touched && form.email.error }]">
        <label class="contact__label" for="contact-email">Email</label>
        <div class="contact__input-wrap">
          <input
            id="contact-email"
            v-model="form.email.value"
            class="contact__input"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            @blur="onBlur('email')"
          />
        </div>
        <Transition name="msg">
          <span v-if="form.email.touched && form.email.error" class="contact__error">
            {{ form.email.error }}
          </span>
        </Transition>
      </div>

      <!-- Message -->
      <div :class="['contact__field', { 'contact__field--error': form.message.touched && form.message.error }]">
        <label class="contact__label" for="contact-message">Message</label>
        <div class="contact__input-wrap">
          <textarea
            id="contact-message"
            v-model="form.message.value"
            class="contact__input contact__input--textarea"
            placeholder="Tell me what's on your mind..."
            rows="4"
            @blur="onBlur('message')"
          />
        </div>
        <Transition name="msg">
          <span v-if="form.message.touched && form.message.error" class="contact__error">
            {{ form.message.error }}
          </span>
        </Transition>
      </div>

      <!-- Server error -->
      <Transition name="msg">
        <p v-if="serverError" class="contact__server-error">{{ serverError }}</p>
      </Transition>

      <!-- Submit — mirrors exact MyButton.vue DOM structure -->
      <div class="contact__actions">
        <div :class="['contact__btn-wrap', { 'contact__btn-wrap--disabled': !isFormValid }]">
          <button
            class="contact__btn"
            type="submit"
            :disabled="status === 'loading'"
          >
            <span v-if="status === 'loading'" class="contact__dots">
              <span /><span /><span />
            </span>
            <template v-else>Send message</template>
          </button>
        </div>
      </div>
    </form>

  </section>
</template>

<style scoped lang="scss">
@use '~/assets/styles/variables' as *;

// ─── Section wrapper ─────────────────────────────────────────────────────────

.contact {
  padding: 0 25px;
}

// ─── Success ─────────────────────────────────────────────────────────────────

.contact__success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-s);
}

.contact__success-title {
  font-size: var(--font-3xl);
  font-weight: 700;
  font-family: var(--font-family-secondary);
  color: var(--primary);
  line-height: 1.1;
}

.contact__success-sub {
  font-size: var(--font-base);
  color: var(--primary);
  opacity: 0.7;
  line-height: 1.6;
}

// ─── Form ────────────────────────────────────────────────────────────────────

.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

// ─── Field ───────────────────────────────────────────────────────────────────
//
//  Two-layer offset pattern — identical to MyButton.vue:
//    contact__input-wrap  =  .button-container  (dark shadow backing)
//    contact__input       =  .button            (visible element, translate3d offset)
//

.contact__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.contact__label {
  font-size: var(--font-sm);
  font-weight: 700;
  font-family: var(--font-family-secondary);
  color: var(--primary);
  line-height: 1.1;
  transition: color 0.15s linear;
}

.contact__input-wrap {
  // = .button-container — dark backing, no margin here
  position: relative;
  border-radius: var(--border-radius);
  background-color: var(--primary);
  transition: background-color 0.15s linear;
}

.contact__input {
  // = .button — floats above backing with same offset
  position: relative;
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--secondary);
  color: var(--primary);
  font-family: var(--font-family-secondary);
  font-size: var(--font-base);
  line-height: 1.5;
  outline: none;
  transform: translate3d(-5px, -5px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.15s linear,
    background-color 0.15s linear;
  -webkit-tap-highlight-color: transparent;

  &::placeholder {
    color: var(--primary);
    opacity: 0.35;
  }

  &:focus {
    border-color: var(--tertiary-dark);
    transform: translate3d(-2px, -2px, 0);
  }

  &--textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.contact__error {
  font-size: var(--font-xs);
  font-family: var(--font-family-secondary);
  font-weight: 700;
  color: #e06c75;
}

.contact__server-error {
  font-size: var(--font-sm);
  font-family: var(--font-family-secondary);
  font-weight: 700;
  color: #e06c75;
}

// Error state — red tint on the backing layer, border and label
.contact__field--error {
  .contact__label      { color: #e06c75; }
  .contact__input-wrap { background-color: #e06c75; }
  .contact__input      { border-color: #e06c75; }
}

// ─── Button — exact copy of MyButton.vue ─────────────────────────────────────

.contact__actions {
  display: flex;
  align-items: center;
  // no extra margin-top — gap on the form handles spacing
}

.contact__btn-wrap {
  // = .button-container
  position: relative;
  margin: var(--space-2xs);
  width: max-content;
  height: max-content;
  border-radius: var(--border-radius);
  background-color: var(--primary);
  transition: background-color 0.15s linear;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.contact__btn {
  // = .button
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border);
  border-radius: inherit;
  padding: 10px 21px;
  color: var(--primary-dark);
  background-color: var(--tertiary);
  font-size: 16px;
  font-family: var(--font-family-secondary);
  font-weight: 700;
  will-change: transform;
  transform: translate3d(-10px, -10px, 0);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.15s linear;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) and (pointer: fine) {
    &:not(:disabled):hover  { transform: translate3d(-3px, -3px, 0); cursor: pointer; }
    &:not(:disabled):active { transform: translate3d(0, 0, 0); }
  }

  &:disabled { transform: translate3d(0, 0, 0); cursor: not-allowed; }
}

// ─── Loading dots — same as AiChatBox ────────────────────────────────────────

.contact__dots {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 2px 4px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: $primary-dark;
    animation: contact-bounce 1.2s infinite ease-in-out;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

// ─── Dark scheme ─────────────────────────────────────────────────────────────

.dark-scheme {
  .contact__btn-wrap   { background-color: var(--stroke); }
  .contact__input-wrap { background-color: var(--stroke); }
}

// ─── Transitions — same name/values as AiChatBox.vue ─────────────────────────

.msg-enter-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.msg-leave-active { transition: opacity 0.15s ease; }
.msg-leave-to     { opacity: 0; }

// ─── Keyframes ────────────────────────────────────────────────────────────────

@keyframes contact-bounce {
  0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
  40%           { transform: translateY(-5px); opacity: 1;   }
}
</style>