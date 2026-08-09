import { useId } from 'react'
import { cn } from '@utils/cn'

/**
 * Campo de formulario con etiqueta, pista y mensaje de error.
 *
 * El sistema de diseño pide etiqueta **encima** del campo y la pista siempre
 * visible debajo: nada de placeholders que se van al escribir y dejan al
 * usuario sin saber qué se le pedía.
 *
 * El borde se pone rojo sólo cuando hay error; el anillo de foco lo pinta la
 * regla global `:focus-visible` de `@style/index.css`, siempre azul institucional.
 *
 * @param {{
 *   label: string,
 *   value: string,
 *   onChange: (valor: string) => void,
 *   name?: string,
 *   type?: string,
 *   required?: boolean,
 *   disabled?: boolean,
 *   placeholder?: string,
 *   hint?: string,
 *   error?: string,
 *   autoComplete?: string,
 *   maxLength?: number,
 * }} props
 */
export function FormField({
  label,
  value,
  onChange,
  name,
  type = 'text',
  required = false,
  disabled = false,
  placeholder,
  hint,
  error,
  autoComplete,
  maxLength,
}) {
  const id = useId()
  const descripcionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 font-normal text-fg-subtle">(opcional)</span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripcionId}
        className={cn('field', error && 'field-invalid')}
      />

      {error ? (
        <p id={descripcionId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={descripcionId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
