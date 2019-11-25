const $t = (text, vars) => [text, vars]

function f (name) {
  console.log($t('文本 function tsx'))

  return (
    <div title={$t('文本 {name} props jsx', {
      name
    })}>
      <h2>
        {$t('文本 children jsx')}
      </h2>
    </div>
  )
}

console.log(f('Test'))
